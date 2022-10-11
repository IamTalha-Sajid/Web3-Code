import Web3Modal from "web3modal";
import { providers } from "ethers";
import { useEffect, useRef, useState } from "react";

const [walletConnected, setWalletConnected] = useState(false);
const web3ModalRef = useRef();


const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Mumbai network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
        changeNetwork()
    }

    if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
    }
    return web3Provider;
};

//Change the Network of the Metamask 
const changeNetwork = async () => {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: Web3.utils.toHex(80001) }]
        });
    } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask
        if (err.code == 4902) {
            window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x13881',
                    chainName: 'Polygon Mumbai',
                    nativeCurrency: {
                        name: 'MATIC',
                        symbol: 'MATIC',
                        decimals: 18
                    },
                    rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
                    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
                }]
            })
                .catch((error) => {
                    console.log(error)
                })
        }
    }
}

//Function to Connect Wallet to the Application 
const connectWallet = async () => {
    try {
        // Get the provider from web3Modal, which in our case is MetaMask
        // When used for the first time, it prompts the user to connect their wallet
        await getProviderOrSigner();
        setWalletConnected(true);
    } catch (err) {
        console.error(err);
    }
};

useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
        // Assign the Web3Modal class to the reference object by setting it's `current` value
        // The `current` value is persisted throughout as long as this page is open
        web3ModalRef.current = new Web3Modal({
            network: "goerli",
            providerOptions: {},
            disableInjectedProvider: false,
        });
        connectWallet();
    }
}, [walletConnected]);
