import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import sendEmail from "../utils/sendEmail";
import multer from "multer";
import Post from "../models/post.model"; // Model yollarını projenize göre ayarlayın.
import { Order } from "../models/order.model";
import Bookmark from "../models/bookmark.model";

// Varsayılan profil resmi için base64 görsel yolu
const DEFAULT_PROFILE_IMAGE = "uploads/default.png";

// Kullanıcı kaydı ve doğrulama kodu gönderimi için kontrolcü
export const signupUser = async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;

  try {
    // Email veya kullanıcı adının daha önce kullanılıp kullanılmadığını kontrol et
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res
        .status(400)
        .json({ message: "Bu e-posta adresi zaten kayıtlı." });
    }

    const existingUserUsername = await User.findOne({ username });
    if (existingUserUsername) {
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı zaten alınmış." });
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 10);

    // Doğrulama kodunu oluştur
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpires = new Date(Date.now() + 3 * 60 * 1000); // 3 dakika

    // Yeni kullanıcıyı oluştur
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      verificationCodeExpires,
      profileImage: DEFAULT_PROFILE_IMAGE,
      badges: ["Hacettepe Üniversitesi"], // <-- ADD THIS LINE
    });

    await newUser.save();

    // Doğrulama e-postasını gönder
    await sendEmail(
      email,
      "Kullanıcı E-posta Doğrulaması",
      `Doğrulama kodunuz: ${verificationCode}. Kod 3 dakika içinde geçersiz olacaktır.`
    );

    res.status(201).json({
      message: "Doğrulama kodu e-posta adresinize gönderildi.",
      email,
    });
  } catch (err: any) {
    console.error("Kayıt Hatası:", err);
    res
      .status(500)
      .json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
  }
};

// Kullanıcıyı verilen doğrulama koduyla doğrulama kontrolcüsü
export const verifyUser = async (req: Request, res: Response) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email, verificationCode });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Geçersiz doğrulama kodu. Lütfen tekrar deneyin." });
    }

    // Doğrulama kodunun süresinin dolup dolmadığını kontrol et
    if (
      user.verificationCodeExpires &&
      user.verificationCodeExpires < new Date()
    ) {
      return res.status(400).json({
        message:
          "Doğrulama kodunun süresi dolmuş. Lütfen yeni bir kod isteyin.",
      });
    }

    // Kullanıcıyı doğrulanmış olarak işaretle ve doğrulama kodunu sil
    await User.updateOne(
      { _id: user._id },
      {
        $set: { isVerified: true },
        $unset: { verificationCode: 1, verificationCodeExpires: 1 },
      }
    );

    res
      .status(200)
      .json({ message: "Doğrulama başarılı. Lütfen giriş yapın." });
  } catch (err) {
    console.error("Doğrulama Hatası:", err);
    res
      .status(500)
      .json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
  }
};

// Kullanıcıya yeni doğrulama kodu gönderimi
export const resendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "Kullanıcı zaten doğrulandı. Lütfen giriş yapın." });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpires = new Date(Date.now() + 3 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    await sendEmail(
      email,
      "Yeni Doğrulama Kodu",
      `Yeni doğrulama kodunuz: ${verificationCode}. Kod 3 dakika içinde geçersiz olacaktır.`
    );

    res
      .status(200)
      .json({ message: "Yeni doğrulama kodu e-posta adresinize gönderildi." });
  } catch (err) {
    console.error("Doğrulama Kodunu Tekrar Gönderme Hatası:", err);
    res
      .status(500)
      .json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
  }
};

// Kullanıcının e-posta veya kullanıcı adı ile giriş yapması kontrolcüsü
export const loginUser = async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Kullanıcıyı e-posta veya kullanıcı adına göre bul
    const user: IUser | null = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Kullanıcı bulunamadı. Lütfen önce kayıt olun." });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Lütfen giriş yapmadan önce e-postanızı doğrulayın.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Geçersiz kimlik bilgileri. Lütfen tekrar deneyin." });
    }

    // JWT token üret
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    // Bio'yu da yanıtın içine ekle
    res.status(200).json({
      message: "Giriş başarılı!",
      token,
      name: user.name,
      username: user.username,
      profileImage: user.profileImage || "",
      bio: user.bio || "",
      userId: user._id,
    });
  } catch (err) {
    console.error("Giriş Hatası:", err);
    res
      .status(500)
      .json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
  }
};

// Şifre sıfırlama linki talep kontrolcüsü
export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Bu e-posta adresine ait kullanıcı bulunamadı." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika sonra geçerli
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${resetToken}`;
    await sendEmail(
      email,
      "Şifre Sıfırlama Talebi",
      `Şifre sıfırlama talebinde bulundunuz. Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın: ${resetUrl}`
    );

    res.status(200).json({
      message: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
    });
  } catch (err) {
    console.error("Şifre Sıfırlama Talebi Hatası:", err);
    res
      .status(500)
      .json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
  }
};

// Şifre sıfırlama kontrolcüsü
export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Geçersiz veya süresi dolmuş token." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message:
        "Şifre sıfırlama başarılı. Artık yeni şifrenizle giriş yapabilirsiniz.",
    });
  } catch (err) {
    console.error("Şifre Sıfırlama Hatası:", err);
    res
      .status(500)
      .json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
  }
};

// Kullanıcıları kullanıcı adına göre arama kontrolcüsü
export const searchUsers = async (req: Request, res: Response) => {
  const { query } = req.query;

  try {
    if (!query) {
      return res.status(400).json({ message: "Sorgu parametresi gereklidir." });
    }

    const users = await User.find({
      username: { $regex: `^${query}`, $options: "i" },
    })
      .select("username profileImage")
      .limit(10);

    res.status(200).json(users);
  } catch (err) {
    console.error("Kullanıcı Arama Hatası:", err);
    res
      .status(500)
      .json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
  }
};

// Kullanıcı profilini güncelleme kontrolcüsü
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Bu klasörün var olduğundan emin olun
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
}).fields([
  { name: "profileImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);

export const updateUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const {
    name,
    username,
    bio,
    salutations,
    work,
    city,
    birthplace,
    relationship,
    phoneNumber,
    highSchool,
    college,
    classes,
    lessons,
    year,
    major,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    // Temel alanları güncelle
    user.name = name || user.name;
    user.username = username || user.username;
    user.bio = bio || user.bio;

    // Kişisel bilgileri güncelle
    user.personalInfo = {
      salutations:
        salutations ||
        (user.personalInfo && user.personalInfo.salutations) ||
        "",
      work: work || (user.personalInfo && user.personalInfo.work) || "",
      city: city || (user.personalInfo && user.personalInfo.city) || "",
      birthplace:
        birthplace || (user.personalInfo && user.personalInfo.birthplace) || "",
      relationship:
        relationship ||
        (user.personalInfo && user.personalInfo.relationship) ||
        "",
      phoneNumber:
        phoneNumber ||
        (user.personalInfo && user.personalInfo.phoneNumber) ||
        "",
      education: {
        highSchool:
          highSchool ||
          (user.personalInfo &&
            user.personalInfo.education &&
            user.personalInfo.education.highSchool) ||
          "",
        college:
          college ||
          (user.personalInfo &&
            user.personalInfo.education &&
            user.personalInfo.education.college) ||
          "",
      },
    };

    // Üniversite bilgilerini güncelle
    user.universityInfo = {
      classes: classes || user.universityInfo?.classes || [],
      lessons: lessons || user.universityInfo?.lessons || [],
      year: year || user.universityInfo?.year || "",
      major: major || user.universityInfo?.major || "",
    };

    // Profil resmi güncellemesi
    if (req.files && "profileImage" in req.files) {
      const profileImage = (
        req.files["profileImage"] as Express.Multer.File[]
      )[0].path;
      user.profileImage = profileImage;
      console.log(`Profil resmi güncellendi: ${profileImage}`);
    }

    // Banner resmi güncellemesi
    if (req.files && "bannerImage" in req.files) {
      const bannerImage = (req.files["bannerImage"] as Express.Multer.File[])[0]
        .path;
      user.bannerImage = bannerImage;
      console.log(`Banner resmi güncellendi: ${bannerImage}`);
    }

    await user.save();

    res.status(200).json({ message: "Profil başarıyla güncellendi.", user });
  } catch (error) {
    console.error("Profil Güncelleme Hatası:", error);
    res
      .status(500)
      .json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
  }
};

export { upload };

// Banner resmi güncelleme kontrolcüsü
export const updateBannerImage = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    if (req.file) {
      const bannerImage = req.file.path;
      user.bannerImage = bannerImage;
      console.log(`Banner resmi güncellendi: ${bannerImage}`);
    }

    await user.save();

    res.status(200).json({
      message: "Banner resmi başarıyla güncellendi.",
      bannerImage: user.bannerImage,
    });
  } catch (error) {
    console.error("Banner Güncelleme Hatası:", error);
    res
      .status(500)
      .json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
  }
};

// Şirket hesabı oluşturma için doğrulama kodu gönderimi
export const sendCompanyVerificationCode = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Bu e-posta kayıtlı değil. Lütfen önce kayıt olun." });
    }

    if (!email.endsWith("@hacettepe.edu.tr")) {
      return res.status(400).json({
        message:
          "Geçersiz e-posta alanı. Lütfen hacettepe.edu.tr e-posta kullanın.",
      });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpires = new Date(Date.now() + 3 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    await sendEmail(
      email,
      "Şirket Hesabı Doğrulama Kodu",
      `Doğrulama kodunuz: ${verificationCode}. Kod 3 dakika içinde geçersiz olacaktır.`
    );

    res
      .status(200)
      .json({ message: "Doğrulama kodu e-posta adresinize gönderildi." });
  } catch (error) {
    console.error("Doğrulama Kodu Gönderme Hatası:", error);
    res
      .status(500)
      .json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
  }
};

// Şirket hesabı oluşturma kodunu doğrulama kontrolcüsü
export const verifyCompanyCode = async (req: Request, res: Response) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email, verificationCode });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Geçersiz doğrulama kodu. Lütfen tekrar deneyin." });
    }

    if (
      user.verificationCodeExpires &&
      user.verificationCodeExpires < new Date()
    ) {
      return res
        .status(400)
        .json({ message: "Doğrulama kodunun süresi doldu." });
    }

    res.status(200).json({
      message:
        "Doğrulama başarılı. Şirket hesabı oluşturma işlemine geçebilirsiniz.",
    });
  } catch (error) {
    console.error("Doğrulama Hatası:", error);
    res
      .status(500)
      .json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Yetkisiz istek." });
  }

  try {
    console.log("Şifre değiştirmeye çalışan kullanıcı:", req.user);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    // Mevcut şifreyi doğrula
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mevcut şifre yanlış." });
    }

    // Yeni şifreyi hash'le ve güncelle
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Şifre başarıyla güncellendi!" });
  } catch (error) {
    console.error("Şifre Güncelleme Hatası:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
};

export const deactivateAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Kullanıcı ID'si gereklidir." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    user.isDeactivated = true;
    await user.save();

    console.log("Hesap devre dışı bırakma başarılı:", user);

    res.status(200).json({
      message: "Hesap başarıyla devre dışı bırakıldı.",
      isDeactivated: user.isDeactivated,
    });
  } catch (error) {
    console.error("Hesap Devre Dışı Bırakma Hatası:", error);
    res.status(500).json({ message: "İç sunucu hatası." });
  }
};

export const deleteUserAccount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Yetkisiz istek." });
  }

  const userId = req.user._id;
  try {
    // İşlemleri bir transaction içerisinde de yapabilirsiniz.
    // 1. Kullanıcının tüm gönderilerindeki beğenilerini ve yorumlarını silin.
    await Post.updateMany(
      {},
      {
        $pull: {
          likes: userId,
          comments: { user: userId },
        },
      }
    );

    // 2. Kullanıcının oluşturduğu tüm gönderileri silin.
    await Post.deleteMany({ user: userId });

    // 3. Kullanıcının oluşturduğu tüm siparişleri silin.
    await Order.deleteMany({ user: userId });

    // 4. Kullanıcıya ait tüm kaydedilen gönderileri (bookmark) silin.
    await Bookmark.deleteMany({ user: userId });

    // (Opsiyonel) Bildirimler, arkadaşlık istekleri, vb. alanları da silin.
    // 5. Son olarak kullanıcı kaydını silin.
    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ message: "Hesap ve ilişkili tüm veriler başarıyla silindi." });
  } catch (error) {
    console.error("Hesap Silme Hatası:", error);
    res
      .status(500)
      .json({ message: "Sunucu hatası. Lütfen daha sonra tekrar deneyin." });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  const { userId, blockedUserId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.blockedUsers.includes(blockedUserId)) {
      user.blockedUsers.push(blockedUserId);
      await user.save();
    }

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const unblockUser = async (req: Request, res: Response) => {
  const { userId, unblockedUserId } = req.body;

  if (!userId || !unblockedUserId) {
    return res.status(400).json({ error: "Eksik bilgi" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Kullanıcı bulunamadı" });

    user.blockedUsers = user.blockedUsers.filter(
      (id) => id.toString() !== unblockedUserId
    );

    await user.save();
    return res.status(200).json({ message: "Kullanıcı engeli kaldırıldı" });
  } catch (error) {
    console.error("Unblock error:", error);
    return res.status(500).json({ error: "Sunucu hatası" });
  }
};
