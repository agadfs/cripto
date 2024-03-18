import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import Web3 from "web3";
import { useDispatch } from 'react-redux';
import { setcurrency, setlanguage } from "../redux/slice";

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
        if(language && currency){
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
        <div>
            <div>
                <div>Choose the currency</div>
                <select onChange={handleCurrencyChange} value={currency} >
                    
                    <option value="usd">USD</option>
                    <option value="brl">BRL</option>
                </select>
            </div>
            <div>
            <div>Choose the language</div>
                <select onChange={handleLanguageChange} value={lang}>
                    
                    <option value="usd">EN-USA</option>
                    <option value="brl">PT-BR</option>
                </select>
            </div>

            <div>
    {!account ?
        <div>
            <button style={{ padding: 10, margin: 10 }} onClick={connect}>
                {lang === 'usd' ? 'Connect wallet' : 'Conectar carteira'}
            </button>
        </div> :
        <div>
            <button style={{ padding: 10, margin: 10 }} onClick={disconnect}>
                {lang === 'usd' ? 'Disconnect wallet' : 'Desconectar carteira'}
            </button>
        </div>}

    {connected && (
        <div>
            <>
                {chainId && `${lang === 'usd' ? 'Connected chain' : 'Rede conectada'}: ${chainId}`}
                <p></p>
                {account && `${lang === 'usd' ? 'Connected account' : 'Conta conectada'}: ${account}`}
                <p></p>
                {walletBalance ? <div>{lang === 'usd' ? 'You have' : 'Você tem'}: {walletBalance} Ethereum</div> : <div>{lang === 'usd' ? 'Could not see the balance of ethereum in your wallet' : 'Não foi possível ver o saldo de ethereum em sua carteira'}</div>}
            </>
        </div>
    )}
</div>


        </div>
    )
}