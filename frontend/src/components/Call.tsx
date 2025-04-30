import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";

interface CallProps {
  friendId: string;
  friendName: string;
  onEndCall?: () => void; // Optional callback to notify parent when call ends
}

const Call: React.FC<CallProps> = ({ friendId, friendName, onEndCall }) => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [callerId, setCallerId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const socket = useRef(io("http://localhost:5001")); // Replace with your server URL
  const [callerName, setCallerName] = useState<string | null>(null);

  useEffect(() => {
    socket.current.on("receiveCall", ({ offer, from, callerName }) => {
      setCallerId(from);
      setCallerName(callerName); // Store caller name
      setIsReceivingCall(true);
      peerConnection.current = createPeerConnection(from);
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
    });

    socket.current.on("callDenied", () => {
      alert("Call was denied by the recipient.");
      endCall();
    });

    return () => {
      socket.current.off("receiveCall");
      socket.current.off("callDenied");
    };
  }, []);

  const createPeerConnection = (targetId: string) => {
    const pc = new RTCPeerConnection();

    pc.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("sendIceCandidate", {
          candidate: event.candidate,
          to: targetId,
        });
      }
    };

    return pc;
  };

  const startCall = async () => {
    try {
      setIsCalling(true);
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = localStream;
      }

      peerConnection.current = createPeerConnection(friendId);
      localStream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, localStream);
      });

      const offer = await peerConnection.current?.createOffer();
      await peerConnection.current?.setLocalDescription(offer!);

      socket.current.emit("callUser", { offer, to: friendId });
    } catch (error) {
      console.error("Error starting call:", error);
      endCall();
    }
  };

  const answerCall = async () => {
    try {
      setIsReceivingCall(false);
      setIsConnected(true);

      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = localStream;
      }

      localStream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, localStream);
      });

      const answer = await peerConnection.current?.createAnswer();
      await peerConnection.current?.setLocalDescription(answer!);

      socket.current.emit("answerCall", { answer, to: callerId });
    } catch (error) {
      console.error("Error answering call:", error);
      endCall();
    }
  };

  const denyCall = () => {
    setIsReceivingCall(false);
    setCallerId(null);
    socket.current.emit("denyCall", { to: callerId });
  };

  const endCall = () => {
    setIsCalling(false);
    setIsReceivingCall(false);
    setCallerId(null);
    setCallerName(null);
    setIsConnected(false);

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    onEndCall?.();
  };

  return (
    <div className="call-container">
      {isReceivingCall && (
        <div className="incoming-call-popup">
          <p>{callerName || "Unknown"} is calling you!</p>
          <button onClick={answerCall} className="answer-btn">
            Answer
          </button>
          <button onClick={denyCall} className="deny-btn">
            Deny
          </button>
        </div>
      )}

      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />

      {isCalling || isConnected ? (
        <button onClick={endCall} className="end-call-btn">
          End Call
        </button>
      ) : (
        <button onClick={startCall} className="start-call-btn">
          Start Call
        </button>
      )}
    </div>
  );
};

export default Call;
