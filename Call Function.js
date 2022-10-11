import Web3 from 'web3';
import {Contract } from "ethers";
import { CONTRACT_ADDRESS, abi } from "../constants";

const stakeETH = async (amount) => {
    try {

        const [stakedETH, setStakedETH] = useState(false);

        if (!amount) {
            return alert('Please add value to stake')
        }
        const signer = await getProviderOrSigner(true);
        const amountInWei = Web3.utils.toWei(amount, 'ether')
        console.log(amountInWei);
        const tokenContract = new Contract(
            CONTRACT_ADDRESS,
            abi,
            signer
        );
        //AdStake is the Name of the Function of the Smart Contract you can change it and Pass Perameters
        const tx = await tokenContract.addStake(amountInWei);

        await tx.wait();
        setStakedETH(true);
    } catch (err) {
        console.error(err);
    }
};