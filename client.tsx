import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import Iframe from "react-iframe";
import { ethers } from "ethers";
import HLS from "hls.js";

declare let window: any;

// Hydrate the starting parameters
const initialGate = {
  contract: "",
  network: "eth",
  standard: "erc721",
  message: `Hello, I hold this NFT. Please let me in.`,
};

const firstUrl = new URL(window.location.href);
for (const [key, value] of firstUrl.searchParams) {
  for (const gateKey of Object.keys(initialGate)) {
    if (key === gateKey) {
      initialGate[key] = value;
    }
  }
}

const sample = (gateParams) => `
{
  "name": "gate for ${gateParams.contract}",
  "url": "${window.location.href}",
  "events": ["playback.user.new"]
}
`;

const App = () => {
  const [errorText, setErrorText] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [proof, setProof] = useState(null);
  const [gate, setGate] = useState(initialGate);

  useEffect(() => {
    const params = new URLSearchParams(gate);
    const newUrl = new URL(window.location.href);
    newUrl.search = `?${params}`;
    window.history.replaceState(null, "", newUrl);
  }, [gate]);

  return (
    <main>
      <h3>Demo PHOG: Compute over Data, Decentralized Linux Environment</h3>
      <h4>Step 1: Use any NFT, on any blockchain</h4>
      <div>
        Token Contract Address:
        <input
          value={gate.contract}
          onChange={(e) => setGate({ ...gate, contract: e.target.value })}
        ></input>
      </div>
      <div>
        Network (default eth):
        <input
          value={gate.network}
          onChange={(e) => setGate({ ...gate, network: e.target.value })}
          placeholder="eth"
        ></input>
      </div>
      <div>
        Token Standard (default erc721):
        <div
          onChange={(e) =>
            setGate({ ...gate, standard: (e.target as any).value })
          }
        >
          &nbsp;ERC-721
          <input
            type="radio"
            value="erc721"
            name="standard"
            checked={gate.standard === "erc721"}
          />
          &nbsp;ERC-1155
          <input
            type="radio"
            value="erc1155"
            name="standard"
            checked={gate.standard === "erc1155"}
          />
        </div>
      </div>
      <div>
        Message to sign
        <input
          value={gate.message}
          onChange={(e) => setGate({ ...gate, message: e.target.value })}
          placeholder="I have the NFT! Give me access."
        ></input>
      </div>

      <h4>Step 2: Compute over Data, Decentralized Linux Environment [CODDLE]  </h4>
      <p>
        This will attempt a log in. If successful, it will spin up
        a browser based PHOG computer.
      </p>
      <button
        onClick={async () => {
          try {
            setErrorText("");
            const provider = new ethers.providers.Web3Provider(
              window.ethereum,
              "any"
            );
            // Prompt user for account connections
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const signed = await signer.signMessage(gate.message);
            const res = await fetch(window.location.href, {
              method: "POST",
              body: JSON.stringify({
                payload: {
                  requestUrl: `https://example.com/hls/fake-stream.m3u8?streamId=fake-stream&proof=${encodeURIComponent(
                    signed
                  )}`,
                },
              }),
            });
            const data = await res.text();
            if (res.status !== 200) {
              setErrorText(data);
              return;
            }
            console.log(data);
            setProof(signed);
          } catch (e) {
            setErrorText(e.message);
          }
        }}
      >
        Log in
      </button>
      <h3 style={{ color: "red" }}>{errorText}</h3>
      {proof && <MistPlayer index={proof} proof={proof} />}

    </main>
  );
};

const MistPlayer = ({ proof, index }) => {
  useEffect(() => {
    setTimeout(() => {
      var a = function () {
        window.mistPlay("5208b31slogl2gw4", {
          target: document.getElementById("mistvideo"),
          urlappend: `?proof=${proof}`,
          // forcePlayer: "hlsjs",
          // forceType: "html5/application/vnd.apple.mpegurl",
          // forcePriority: {
          //   source: [["type", ["html5/application/vnd.apple.mpegurl"]]],
          // },
        });
      };
      if (!window.mistplayers) {
        var p = document.createElement("script");
        p.src = "https://playback.livepeer.engineering/player.js";
        document.head.appendChild(p);
        p.onload = a;
      } else {
        a();
      }
    });
  }, [proof]);
  return <Iframe url="http://localhost:8000/computer/coddle.html"
        width="1048px"
        height="832px"
	border="0px"
        id=""
        className=""
        display="block"
        position="relative"/>
};

ReactDOM.render(<App />, document.querySelector("main"));
