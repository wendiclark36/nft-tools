import { ethers } from 'ethers';
import WalletBalance from './WalletBalance';
import CertificationContract from '../artifacts/contracts/Certification.sol/Certification.json';
import { useEffect, useState } from 'react';

const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
const provider = new ethers.providers.Web3Provider(window.ethereum);

//get the end users Ethereum account
const endUserSigner = provider.getSigner();

//get the contract
const certificationContract = new ethers.Contract(contractAddress, CertificationContract.abi, endUserSigner);

function Home() {

    const [totalMinted, setTotalMinted] = useState(0);
    useEffect( () => {
        getCount();
    }, []);

    const getCount = async () => {
        const count = await certificationContract.count();
        setTotalMinted(parseInt(count));
    }

    return(
        <div>
            <WalletBalance />
            <h1>Adrian's Personal NFT Collection</h1>
            <div className='container'>
                <div className='row'>
                    {Array(totalMinted + 1)
                        .fill(0)
                        .map((_, i) => (
                            <div key={i}>
                                <NFTImage tokenId={i} />
                            </div>
                        ))}
                </div>
            </div>
            
        </div>
    );
}

function NFTImage({tokenId, getCount}){
    const contentId = 'Qmc1zAxhtwnVSBLN8P46LWWarYEx5uSNGXvaurWYMH5jAD';
    const metadataURI = `${contentId}/${tokenId}`;
    // const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.jpg`
    const imageURI = `img/${tokenId}.jpg`

    const [isMinted, setIsMinted] = useState(false);

    useEffect(() => {
        getMintedStatus();
    }, [isMinted])

    const getMintedStatus = async () => {
        const result = await certificationContract.isCertificationOwned(metadataURI);
        console.log(result);
        setIsMinted(result);
    };

    const mintToken = async() => {
        const connection = certificationContract.connect(endUserSigner);
        const address = connection.address;
        const result = await certificationContract.learnToMint(address, metadataURI);
        
        await result.wait();
        getMintedStatus();
    };

    async function getURI(){
        const uri = await certificationContract.tokenURI(tokenId);
    }

    return(
        <div>
            <img src={isMinted? imageURI : 'img/placeholder.png'}></img>
            <div>
                <h5>ID #{tokenId}</h5>
                {!isMinted ? (
                    <button onClick={mintToken}>Mint</button>
                ) : (
                    <button onClick={getURI}>Taken! Show URI</button>
                )}
            </div>
        </div>
    );
}

export default Home;