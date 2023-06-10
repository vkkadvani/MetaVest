// import React, { useState, createContext, useContext, useEffect } from 'react'
import ABI from '../ABI/ABI.json'
import Popup from './Popup';
import 'react-toastify/dist/ReactToastify.css';
import LandingLock from '../Animation/LandingLock';
import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../App'
import { toast } from 'react-toastify';
import { extractReasonFromErrorMessage, calculateDuration, convertSeconds, convertToDateTime } from '../util/util'
const ethers = require("ethers")

const VestingDetail = () => {
    const contractAddress = '0xf8d318205eD763959Fb79FF55469C6071Fe061a7';
    const { WalletConnection, setWalletConnection } = useContext(AppContext)
    const { whitemod_flag } = useContext(AppContext)
    const { vestingId } = useParams();
    const [withdraw_btn_disable, setDisable] = useState(true)
    const [calculate_btn_disable, setDisableC] = useState(false)
    const [data, setVestingData] = useState()
    const [loading, setLoading] = useState(false)
    const [withdrawable, setWithdrawableToken] = useState(0)
    const [Flag, setFlag] = useState(0);
    const [statusOfVesting, setVestingStatus] = useState(false)
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const dbVestingId = queryParams.get("dbVestingId");

    const style = {
        outer_div: `flex min-h-fit items-center px-24`,
        div_inner: !whitemod_flag ? `h-fit pb-10 w-full bg-grey m-12 rounded-xl  ` : `h-fit pb-10 w-full bg-light_pink m-12 rounded-xl  `,
        title_text: `font-vesting text-pink text-3xl justify-self-start`,
        title_div: `flex m-6`,
        form_div: whitemod_flag ? `m-11 bg-white_text shadow-[rgba(0,_0,_0,_0.24)_0px_0px_5px] rounded-xl` : `m-11 bg-dim_black  shadow-[rgba(0,_0,_0,_0.24)_0px_0px_10px] rounded-xl`,
        input_form_div: `flex justify-center `,
        btn_withdraw: withdraw_btn_disable ? `bg-pink opacity-25 font-vesting rounded-full px-6 h-10 box-border mx-10  ` : `bg-pink font-vesting rounded-full px-6 h-10 box-border mx-10  `,
        btn_calculate: calculate_btn_disable ? `bg-pink opacity-25 font-vesting rounded-full px-6 h-10 box-border mx-10  ` : `bg-pink font-vesting rounded-full px-6 h-10 box-border mx-10  `,
        input_field: `bg-white_text rounded font-form mb-10 w-full h-8 p-2`,
        input_label: whitemod_flag ? `font-form text-dim_black justify-self-start mt-4 text-xl` : `font-form text-white justify-self-start mt-4 text-xl`,
        input_label_green: `font-form text-green justify-self-start mt-4 text-xl`,
        input_form_div_left: `mb-0 pb-0 mt-4 pt-0 flex flex-col items-start rounded-xl m-9 p-11 w-full`,
        network_div: `rounded-xl bg-white_text h-12 w-full mx-9 flex items-center pl-4`,
        cmp_network: `px-11`,
        networkLogo: `h-8 px-4`,
        network_name: `font-form pl-2`,
        data: whitemod_flag ? `text-dim_black pb-4` : `text-white_text pb-4`,
        data_green: `text-green pb-4`
    }

    useEffect(() => {
        const getVestingData = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const wallet_add = await provider.send("eth_requestAccounts", []);

            //DB entry
            const getVesting = await fetch("http://localhost:3000/vesting", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json ;charset=utf-8' },
                body: JSON.stringify({
                    beneficiary: wallet_add[0],
                    networkId: provider.provider.networkVersion,
                    vestingId: dbVestingId,
                    secretkey: "metavestbest",
                    accsessToken: localStorage.getItem('jwt')
                })
            })
            const vestingData = await getVesting.json()

            if (vestingData.verify == false) {
                navigate('/home');
                fireToast("error", "You need to Re-Authenticate")
            }
            // const status = (Number(await contract.getTime()) > (Number(((await contract.vestings(wallet_add[0], vestingId)).params).start))) && (Number(await contract.getTime()) < (Number(await contract.getTime()) + (Number(((await contract.vestings(wallet_add[0], vestingId)).params).duration))))
            // setVestingStatus(true)

            setVestingData(vestingData)
            // getDecimal(tempschedule.params.TokenAddress)
            if (vestingData.locked) {
                // setDisable(false)
                setDisableC(false)
            }
            else {
                setDisableC(true)
                setDisable(true);
                setVestingStatus(false)
            }
        }
        getVestingData()

    }, [Flag])

    const calculate_withdrawable = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ABI, signer);
        const withdrawable = await contract.calculate_available_withdraw_token(vestingId);
        setWithdrawableToken(parseInt(withdrawable));
        if (parseInt(withdrawable) == 0) {
            setDisable(true)
            fireToast('warn', 'Not enough amount for withdraw')
        }
        else
            setDisable(false)
    }

    const withdraw = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const wallet_add = await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, ABI, signer);
            const tx = await contract.withdraw(vestingId);
            setLoading(true)
            await tx.wait()
            let claimed = ((await contract.vestings(wallet_add[0], vestingId))).claimed;

            //Db Update
            console.log("for update token id :", data.tokenId, "claimed :", parseInt(claimed));
            const updateVesting = await fetch("http://localhost:3000/updateVesting", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json ;charset=utf-8' },
                body: JSON.stringify({
                    amount: parseInt(data.amount),
                    beneficiary: wallet_add[0],
                    networkId: provider.provider.networkVersion,
                    vestingId: dbVestingId,
                    claimed: parseInt(claimed),
                    secretkey: "metavestbest",
                    tokenId: data.tokenId,
                    accsessToken: localStorage.getItem('jwt')
                })
            })
            setLoading(false)
            fireToast('success', 'Transaction successful')
        }
        catch (e) {
            let msg = extractReasonFromErrorMessage(e)
            fireToast('error', e.message)
        }

    }

    window.addEventListener('load', () => {
        setFlag(Flag + 1);
    });

    window.ethereum.on("accountsChanged", (accounts) => {
        setFlag(Flag + 1)
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
        if (type == 'warn') {
            toast.warn(msg, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: whitemod_flag ? "light" : "dark",
            });
        }
    }

    return (
        <div className={style.outer_div}>
            {WalletConnection
                ?
                (loading
                    ?
                    <LandingLock />
                    :
                    <div className={style.div_inner}>
                        <div className={style.title_div}>
                            <p className={style.title_text}>Vesting Detail</p>
                        </div>
                        <div className={style.form_div}>
                            {data &&
                                <div className={style.input_form_div}>
                                    <div className={style.input_form_div_left}>
                                        <p className={style.input_label}>Amount</p>
                                        <p className={style.data}>{(Number(data.amount))}</p>
                                        <p className={style.input_label}>Start Time</p>
                                        <p className={style.data}>{convertToDateTime(data.starttime)}</p>
                                        <p className={style.input_label}>End Time</p>
                                        <p className={style.data}>{convertToDateTime((data.endTime))}</p>


                                        <p className={style.input_label}>Duration</p>
                                        <p className={style.data}>{calculateDuration(data.starttime, data.endTime)}</p>
                                        <p className={style.input_label}>Beneficiaries</p>
                                        <p className={style.data}>{data.beneficiary}</p>
                                        <p className={style.input_label}>Address Of Token</p>
                                        <p className={style.data}>{data.token_data.tokenAddress}</p>


                                    </div>
                                    <div className={style.input_form_div_left}>
                                        <p className={style.input_label}>Claimed</p>
                                        <p className={style.data}>{Number(data.claimed)}</p>
                                        <p className={style.input_label}>Locked</p>
                                        <p className={style.data}>{data.locked ? "Active" : "Unactive"}</p>
                                        <p className={style.input_label}>Cliff</p>
                                        <p className={style.data}>{convertToDateTime((data.cliff))}</p>
                                        <p className={style.input_label}>Slice Period</p>
                                        <p className={style.data}>{convertSeconds(parseInt(data.slicePeriod))}</p>
                                        <p className={style.input_label}>Recive on Interval</p>
                                        <p className={style.data}>{Number(data.recieveOnInterval)}</p>
                                        <p className={style.input_label_green}>Withdrawable</p>
                                        <p className={style.data_green}>{withdrawable / (10 ** data.token_data.decimals)}</p>
                                    </div>
                                </div>}


                        </div>
                        <div>
                            <button className={style.btn_calculate} disabled={calculate_btn_disable} onClick={calculate_withdrawable}>Calculate</button>
                            <button className={style.btn_withdraw} disabled={withdraw_btn_disable} onClick={withdraw}>Withdraw</button>
                        </div>
                    </div>
                )
                :
                <Popup />
            }
        </div>
    )
}

export default VestingDetail