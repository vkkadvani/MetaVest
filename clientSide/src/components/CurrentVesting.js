import React, { useEffect, useState, useContext } from 'react'
import { Dna } from 'react-loader-spinner'
import { AppContext } from '../App'
import { Navigate, NavLink, useNavigate } from 'react-router-dom'
import ABI from '../ABI/ABI.json'
import Popup from './Popup'
import { toast } from 'react-toastify';
const ethers = require("ethers")

const CurrentVesting = () => {

    const { WalletConnection, setWalletConnection } = useContext(AppContext)
    const { whitemod_flag, setWhitemodflag } = useContext(AppContext);
    const [data, setData] = useState()
    const [loading, setLoading] = useState(false)
    const [flag, setFlag] = useState(0)
    const contractAddress = '0xf8d318205eD763959Fb79FF55469C6071Fe061a7';
    const navigate = useNavigate();

    const style = {
        outer_div: `flex min-h-fit items-center px-24`,
        div_inner: !whitemod_flag ? `h-fit pb-10 w-full bg-grey m-12 rounded-xl ` : `h-fit pb-10 w-full h-72 bg-light_pink m-12 rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_0px_10px] `,
        title_text: `font-vesting text-pink text-3xl justify-self-start`,
        title_div: `flex m-6`,
        title_data: `grid grid-cols-5 gap-4 mb-2 font-bold font-form bg-pink rounded-xl h-12 items-center mx-10`,
        vesting_data: whitemod_flag ? `grid grid-cols-5 mt-4 gap-4  bg-white_text rounded-xl h-10 items-center mx-10` : `grid grid-cols-5 mt-4 gap-4  bg-dim_black text-white rounded-xl h-10 items-center mx-10`,

    }


    useEffect(() => {
        const getVesting = async () => {
            setLoading(true)
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const wallet_add = await provider.send("eth_requestAccounts", []);
            const beneficiaries = await wallet_add[0]
            // const signer = provider.getSigner();
            // const contract = new ethers.Contract(contractAddress, ABI, signer);
            // const vestedSchedules = [];
            // const len_vesting = parseInt(await contract.getTotalVesting());

            // let Tokencontract = null;
            // for (let i = 0; i < len_vesting; i++) {
            //     let tempschedule = await contract.vestings(wallet_add[0], i);
            //     const tokenContractAddress = (tempschedule.params.TokenAddress);
            //     if (provider.provider.networkVersion == 80001)
            //         Tokencontract = await fetch(`https://api-testnet.polygonscan.com/api?module=contract&action=getabi&address=${tokenContractAddress}&apikey=6Z536YUCYRCIDW1CR53QAS1PYZ41X2FA7K`)
            //     else if (provider.provider.networkVersion == 11155111)
            //         Tokencontract = await fetch(`https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${tokenContractAddress}&apikey=WSG13CQU7C9GAHQIRH3J51BPRDYDSC835B`)
            //     const respo = await Tokencontract.json()
            //     const Tcontract = new ethers.Contract(tokenContractAddress, respo.result, signer);
            //     const decimal = Number(await Tcontract.decimals())
            //     tempschedule = { ...tempschedule, decimal }
            //     vestedSchedules.push(await tempschedule);
            // }
            const networkId = await provider.provider.networkVersion;
            // console.log("before fetching : ", beneficiaries, networkId);
            const getVestingData = await fetch("http://localhost:3000/vestings", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json ;charset=utf-8' },
                body: JSON.stringify({
                    beneficiary: beneficiaries,
                    networkId: networkId,
                    secretkey: "metavestbest",
                    accsessToken: localStorage.getItem('jwt')
                })
            })
            const allVestingData = await getVestingData.json()
            if (allVestingData.verify == false) {
                navigate('/home');
                fireToast("error", "You need to Re-Authenticate")
            }
            // console.log("Response:", allVestingData);
            setData(allVestingData);
            setLoading(false);
        }
        getVesting()
    }, [flag])

    window.addEventListener('load', () => {
        setFlag(1);
    });

    window.ethereum.on("accountsChanged", (accounts) => {
        setFlag(flag + 1)
        if (accounts.length === 0) {
            setWalletConnection(false)
        }
    })
    function fireToast(type, msg) {
        if (type == 'error') {

            toast.error(msg, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: whitemod_flag ? "light" : "dark",
            })
        }
        if (type == 'success') {
            toast.success(msg, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: whitemod_flag ? "light" : "dark",
            })
        }
    }
    return (<>
        <div className={style.outer_div}>
            {WalletConnection
                ?
                <div className={style.div_inner} >
                    <div className={style.title_div}>
                        <p className={style.title_text}>Current Vesting</p>
                    </div>
                    <div className={style.title_data}>
                        <div>Id</div>
                        <div class='col-span-2 '>Beneficiaries</div>
                        <div>Amount</div>
                        <div>Claimed</div>
                    </div>

                    {loading
                        ?
                        <div className='flex justify-center'><Dna /></div>
                        :
                        data
                        &&
                        data.map((e, index) => {
                            return (
                                <NavLink to={`/vestingDetail/${index}?dbVestingId=${e.vestingId}`} key={index}>
                                    <div className={style.vesting_data}>
                                        <div>{index}</div>
                                        <div class='col-span-2'>{e.beneficiary}</div>
                                        <div>{((parseInt(e.amount)))}</div>
                                        <div>{Number(e.claimed)}</div>
                                    </div>
                                </NavLink>
                            )
                        })
                    }
                </div>
                :
                <Popup />
            }
        </div>
    </>
    )
}

export default CurrentVesting