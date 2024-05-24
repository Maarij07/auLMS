import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useLocalContext } from '../../context/context';
import db from '../../lib/firebase';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';



function randomID(len) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(
  url = window.location.href
) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

export default function ZegoCLoud() {
  const roomID = getUrlParams().get('roomID') || randomID(5);
  const { loggedInMail, callClass } = useLocalContext();
  let myMeeting = async (element) => {
    // generate Kit Token
    const appID = 170039570;
    const serverSecret = "f92e80b7cd3000108a278d350ad22f71";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), randomID(5));
    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    const sharedLinks = [
      {
        name: 'Personal link',
        url:
          window.location.protocol + '//' +
          window.location.host + window.location.pathname +
          '?roomID=' +
          roomID,
      },
    ];

    zp.joinRoom({
      container: element,
      sharedLinks: sharedLinks,
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });


    const mainDoc = doc(db, `Calls/${callClass}`);
    const childDoc= doc(mainDoc, 'callLink/byOwner');
    function getTextStartingWithCall(url) {
      if (url && url.includes("/call")) {
        // If the URL contains "/call", return the substring starting from "/call"
        return url.substring(url.indexOf("/call"));
      } else {
        // If "/call" is not found, return null or any default value as needed
        return null;
      }
    }
    const sentence = sharedLinks[0].url;
    const callLink = getTextStartingWithCall(sentence);
    console.log(callClass);

    await setDoc(childDoc,{
      call: callLink
    },{merge:true})
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}