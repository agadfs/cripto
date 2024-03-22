import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import detectEthereumProvider from '@metamask/detect-provider';
import { setcurrency, setlanguage } from "../redux/slice";
import styles from './Wallet.module.css';
import Web3 from "web3";

export default function Wallet() {

    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [isBoxVisible, setIsBoxVisible] = useState(false);
    const { lang, currency } = useSelector(state => state.useroptions);
    const dispatch = useDispatch();

    const toggleBoxVisibility = () => {
        setIsBoxVisible(!isBoxVisible);
    };

    const handleCurrencyChange = (event) => {
        const selectedCurrency = event.target.value;
        dispatch(setcurrency(selectedCurrency));
        localStorage.setItem('currency', selectedCurrency);
    };

    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;
        dispatch(setlanguage(selectedLanguage));
        localStorage.setItem('language', selectedLanguage);

    };

    const connectWallet = async () => {
        try {
            const provider = await detectEthereumProvider();
            if (provider) {
                const accounts = await provider.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
                setIsConnected(true);
                localStorage.setItem('isConnected', true);
            } else {
                console.error('Please install Metamask to continue.');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setIsConnected(false);
        localStorage.removeItem('isConnected');
        localStorage.removeItem('accountId');
    };
     /* useEffect(() => {
        const fetchData = async () => {
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
        fetchData();
    }, [account]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const connected = localStorage.getItem('isConnected')
                if (connected) {
                    const provider = await detectEthereumProvider();
                    if (provider) {

                        await provider.request({ method: 'eth_requestAccounts' });
                        const accounts = await provider.request({ method: 'eth_accounts' });
                        if (accounts.length > 0) {
                            setAccount(accounts[0]);
                            setIsConnected(true);
                        }

                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                localStorage.removeItem('isConnected')
            }
        };
        const lang = localStorage.getItem('language');
        const currency = localStorage.getItem('currency');
        if (lang && currency) {

            dispatch(setlanguage(lang));
            dispatch(setcurrency(currency));
        } else {
            localStorage.setItem('language', 'usd');
            localStorage.setItem('currency', 'usd');
        }
        fetchData();
    }, []);  */

    return (
        <div className={styles.walletbody}>
            <div className={styles.langcurrency}>
                <div>
                    <div>{lang === 'usd' ? 'Select the currency' : 'Selecione a moeda'}</div>
                    <select style={{ margin: '5px', padding: '5px' }} onChange={() => handleCurrencyChange()} value={currency}>
                        <option value="usd">USD</option>
                        <option value="brl">BRL</option>
                    </select>
                </div>
                <div>
                    <div>{lang === 'usd' ? 'Choose the language' : 'Escolha o idioma'}</div>
                    <select style={{ margin: '5px', padding: '5px' }} onChange={() => handleLanguageChange()} value={lang}>
                        <option value="usd">EN-USA</option>
                        <option value="brl">PT-BR</option>
                    </select>
                </div>
            </div>
            <div className={styles.walletinfo}>
                {!isConnected ?
                    <div>
                        <button className={styles.buttonlink} onClick={() => connectWallet()}>
                            {lang === 'usd' ? 'Connect wallet' : 'Conectar carteira'}
                        </button>
                    </div> :
                    <div>
                        <button className={styles.buttonlink} onClick={() => disconnectWallet()}>
                            {lang === 'usd' ? 'Disconnect wallet' : 'Desconectar carteira'}
                        </button>
                    </div>
                }
                <div>
                    {isConnected && (
                        <div className={styles.accountdisplay}>
                            <button className={styles.buttonlink} id="toggleButton" onClick={() => toggleBoxVisibility()}>
                                {lang === 'usd' ? 'Show account info' : 'Mostrar informações da conta'}
                            </button>
                            <div id="slideBox" className={`${styles.slidebox} ${isBoxVisible ? styles.show : ''}`}>
                                <div className={styles.accountinfo2}>
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
        </div>
    );
}
