import { useEffect, useState } from "react";
import { 
  connectWallet,
  getCurrentWalletConnected,
  mintNFT
} from "./utils/interact.js";

const Minter = (props) => {
  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  useEffect(async () => {
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("๐๐ฝ Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("๐ฆ Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          ๐ฆ{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { status } = await mintNFT(url, name, description);
    setStatus(status);
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">๐พ NFT Minter ๐พ</h1>
      <p>
        AlchemyใไฝฟใฃใMinting็ฐๅขใๆง็ฏไธญโฆใ
      </p>
      <form>
        <h2>๐ง ContractใไฝๆใใGUI๏ผๆชๅฎ่ฃ๏ผ</h2>
        <p>___</p>
        <h2>๐ผ Link to asset: </h2>
        <p>Pinataใงipfsใซใใกใคใซใใขใใใญใผใใใ็บ่กใใใURLใไปฅไธใซ่ฒผใไปใใใๅฐๆฅ็ใซใAPIใงๅไฝใใๆงใซใใใใ</p>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>๐ค Name: </h2>
        <p>NFTใฎๅๅใๅฅๅใใใ</p>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>โ๏ธ Description: </h2>
        <p>NFTใฎDescriptionใๅฅๅใใใ</p>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}

        
      </p>
    </div>
  );
};

export default Minter;
