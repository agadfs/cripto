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
    const [isBoxVisible, setIsBoxVisible] = useState(false);
    const toggleBoxVisibility = () => {
        setIsBoxVisible(!isBoxVisible);
    };
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
            const accounts = await sdk?.terminate();

            setAccount(undefined);
            localStorage.removeItem('accountId');



        } catch (err) {
            console.warn("failed to disconnect..", err);
        }
    };
    useEffect(() => {
        const id = localStorage.getItem('accountId')

        const fetchData = async () => {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length === 0) {
                    console.log('No accounts');
                    setAccount(null); 
                } else {
                    const account = accounts[0];
                    console.log('Logged-in account:', account);
                    setAccount(account);
                    localStorage.setItem('accountId', account)
                }
            } catch (error) {
                console.error('Failed to get accounts:', error);
                localStorage.removeItem('accountId')
            }
        };
        
        if (id) {
            fetchData();
            setAccount(id)

        }
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
            <div className={styles.langcurrency}>
                <div>
                    <div>{lang === 'usd' ? 'Select the currency' : 'Selecione a moeda'}</div>
                    <select style={{ margin: '5px', padding: '5px' }} onChange={handleCurrencyChange} value={currency} >

                        <option value="usd">USD</option>
                        <option value="brl">BRL</option>
                    </select>
                </div>
                <div>
                    <div>{lang === 'usd' ? 'Choose the language' : 'Escolha o idioma'}</div>
                    <select style={{ margin: '5px', padding: '5px' }} onChange={handleLanguageChange} value={lang}>

                        <option value="usd">EN-USA</option>
                        <option value="brl">PT-BR</option>
                    </select>
                </div>


            </div>
            <div className={styles.walletinfo} >
                {!account ?
                    <div>
                        <button className={styles.buttonlink} onClick={connect}>
                            {lang === 'usd' ? 'Connect wallet' : 'Conectar carteira'}
                        </button>
                    </div> :
                    <div>
                        <button className={styles.buttonlink} onClick={disconnect}>
                            {lang === 'usd' ? 'Disconnect wallet' : 'Desconectar carteira'}
                        </button>
                    </div>}
                <div>
                    {connected && (
                        <div className={styles.accountdisplay} >
                            <button className={styles.buttonlink} id="toggleButton" onClick={toggleBoxVisibility}>{lang === 'usd' ? 'Show account info' : 'Mostrar informações da conta'}</button>
                            <div id="slideBox" className={`${styles.slidebox} ${isBoxVisible ? styles.show : ''}`}>
                                <div className={styles.accountinfo2}>
                                    <div>
                                        {chainId && <strong>{lang === 'usd' ? 'Connected chain' : 'Rede conectada'}:</strong>} {chainId}
                                    </div>
                                    <div>
                                        {account && <strong>{lang === 'usd' ? 'Connected metamask account' : 'Conta metamask conectada'}:</strong>} {account}
                                    </div>
                                    <div>
                                        {walletBalance ?
                                            <div>
                                                <strong>{lang === 'usd' ? 'You have' : 'Você tem'}:</strong> {walletBalance} Ethereum
                                            </div>
                                            :
                                            <div>
                                                <strong>{lang === 'usd' ? 'Could not see the balance of ethereum in your wallet' : 'Não foi possível ver o saldo de ethereum em sua carteira'}:</strong>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>


                <div>
                    {window.location.pathname === '/' ?
                        null :
                        <button className={styles.buttonlink} onClick={() => {
                            window.location.href = '/';
                        }}>
                            {lang === 'usd' ? 'Go back to home page' : 'Voltar a pagina inicial'}
                        </button>}

                </div>

            </div>


        </div >
    )
}