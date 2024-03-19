import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import Web3 from "web3";
import { useDispatch } from 'react-redux';
import { setcurrency, setlanguage } from "../redux/slice";
import styles from './Wallet.module.css'
export default function Home() {

    const { lang, currency } = useSelector(state => state.useroptions);
    const [account, setAccount] = useState();
    const [walletBalance, setWalletBalance] = useState(null);
    const dispatch = useDispatch();
    const { sdk, connected, connecting, provider, chainId } = useSDK();
    const connect = async () => {
        try {
            const accounts = await sdk?.connect();
            setAccount(accounts?.[0]);
            console.log(accounts?.[0])
            localStorage.setItem('accountId', accounts?.[0])


        } catch (err) {
            console.warn("failed to connect..", err);
        }
    };
    const handleCurrencyChange = (event) => {
        const selectedCurrency = event.target.value;
        dispatch(setcurrency(selectedCurrency));
        localStorage.setItem('currency', selectedCurrency)
    };

    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;
        dispatch(setlanguage(selectedLanguage));
        localStorage.setItem('language', selectedLanguage)
    };
    const disconnect = async () => {
        try {
            const accounts = await sdk?.disconnect();
            localStorage.setItem('accountId', accounts)
            setAccount();



        } catch (err) {
            console.warn("failed to disconnect..", err);
        }
    };
    useEffect(() => {
        const id = localStorage.getItem('accountId')
        setAccount(id)
        const language = localStorage.getItem('language')
        const currencytype = localStorage.getItem('currency')
        if (language && currency) {
            dispatch(setcurrency(currencytype));
            dispatch(setlanguage(language));
        }
    }, []);

    useEffect(() => {
        const getBalance = async () => {
            if (account) {
                try {
                    const web3 = new Web3(window.ethereum);
                    const balance = await web3.eth.getBalance(account);

                    const balanceInEther = web3.utils.fromWei(balance, 'ether');

                    setWalletBalance(balanceInEther);
                } catch (error) {
                    console.error('Failed to retrieve wallet balance:', error);
                }
            }
        };

        getBalance();
    }, [account]);
    return (
        <div className={styles.walletbody} >
            <div>


                <div>
                    <div>{lang === 'usd' ? 'Select the currency' : 'Selecione a moeda'}</div>
                    <select onChange={handleCurrencyChange} value={currency} >

                        <option value="usd">USD</option>
                        <option value="brl">BRL</option>
                    </select>
                </div>
                <div>
                    <div>{lang === 'usd' ? 'Choose the language' : 'Escolha o idioma'}</div>
                    <select onChange={handleLanguageChange} value={lang}>

                        <option value="usd">EN-USA</option>
                        <option value="brl">PT-BR</option>
                    </select>
                </div>


            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', gap:'10px' }} >
                {!account ?
                    <div>
                        <button  className={styles.buttonlink} onClick={connect}>
                            {lang === 'usd' ? 'Connect wallet' : 'Conectar carteira'}
                        </button>
                    </div> :
                    <div>
                        <button className={styles.buttonlink} onClick={disconnect}>
                            {lang === 'usd' ? 'Disconnect wallet' : 'Desconectar carteira'}
                        </button>
                    </div>}

                {connected && (
                    <div style={{ display: 'flex', gap: '20px' }} >
                        <>
                            {chainId && `${lang === 'usd' ? 'Connected chain' : 'Rede conectada'}: ${chainId}`}
                            <p></p>
                            {account && `${lang === 'usd' ? 'Connected metamask account' : 'Conta metamask conectada'}: ${account}`}
                            <p></p>
                            {walletBalance ? <div>{lang === 'usd' ? 'You have' : 'Você tem'}: {walletBalance} Ethereum</div> : <div>{lang === 'usd' ? 'Could not see the balance of ethereum in your wallet' : 'Não foi possível ver o saldo de ethereum em sua carteira'}</div>}
                        </>
                    </div>
                )}
                <div>
                <button className={styles.buttonlink} onClick={() => {
                    window.location.href = '/';
                }}>
                            {lang === 'usd' ? 'Go back to home page' : 'Voltar a pagina inicial'}
                        </button>
                </div>
                
            </div>


        </div>
    )
}