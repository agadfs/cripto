
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import styles from './home.module.css'

export default function Home() {
    const [coinsdata, setCoinsData] = useState([]);
    const { lang, currency } = useSelector(state => state.useroptions);
    const [currencystate, setcurrencystate] = useState();
    const [countdowntimer, setCountDownTimer] = useState();
    const [updatedata, setupdatedata] = useState(false);
    useEffect(() => {
        const oldcoinsarray = localStorage.getItem('coinsarray')
        const oldcoincurrency = localStorage.getItem('coinscurrency');
        const fetchCoins = async () => {
            try {
                const coinsdata = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en`
                const response = await fetch(coinsdata, { method: 'GET', headers: {
                    'Content-Type': 'application/json',
                    'x-cg-demo-api-key': 'CG-gSukq7hMzyfEsiiM2HS4iyA5'
                }})
                const coins = await response.json()
                localStorage.setItem('coinsarray', JSON.stringify(coins));
                localStorage.setItem('coinscurrency', currency);
                setCoinsData(coins)
                console.log('Coins data updated')
                setcurrencystate(currency)
                setupdatedata(!updatedata)

            } catch (error) {
                console.log('Failed to retrieve data, retrying in 8 seconds...  ', error)
                const countdownInterval = setInterval(() => {
                    setupdatedata(!updatedata)
                }, 5000);
            }
        }
        if (!oldcoinsarray) {
            fetchCoins()
        } else {
            setCoinsData(JSON.parse(oldcoinsarray));
            setcurrencystate(oldcoincurrency)
            let countdown = localStorage.getItem('fetchcountdown');
            const countdownInterval = setInterval(() => {
                countdown--;
                localStorage.setItem('fetchcountdown', countdown)
                setCountDownTimer(countdown)
                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    localStorage.setItem('fetchcountdown', 8)
                    fetchCoins();  
                }
            }, 1000);
            return () => clearInterval(countdownInterval);
        }
    }, [currency, updatedata]);
    return (
        <div className={styles.homebody} >
            <h1 className={styles.infotimer0}>{lang === 'usd' ? `To prevent the API coinsgecko blocking too many requests...` : `Para evitar que a API coinsgecko bloqueie muitas requisições...`}</h1>
            <h1 className={styles.infotimer} >
            {lang === 'usd' ? `You can update currency and get updated data in: ${countdowntimer} seconds` : `Você pode atualizar os dados e mudar a moeda em:  ${countdowntimer} segundos`} </h1>
            <div className={styles.coinslistbody}>
                <div style={{textAlign:'center', display: 'flex', width: '100%', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', flexDirection:'column' }} >
                    {lang === 'usd' ? 'Market Cap Ranking' : 'Ranking de Capitalização de Mercado'} 
                    {coinsdata.length >= 10 ? null : <div>{lang === 'usd' ? `Please await, requesting data...` : `Por favor, aguarde enquanto os dados são carregados...`}</div>}
                </div>
                {coinsdata?.map(coins => {
                    return (
                        <div className={styles.coinbutton} onClick={() => {
                            window.location.href = `/${coins.id}`
                        }} 
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#232F3E'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#131A22'}
                        key={coins?.id}>
                            <div>
                                {coins?.market_cap_rank}#
                            </div>
                            <div  >
                                <img style={{ width: '35px', height: '35px' }} src={coins?.image} />
                            </div>
                            <div> {coins?.name} </div>
                            <div style={{ display: 'flex', gap: '5px' }}  > {coins?.current_price},00 {currencystate === 'usd' ? <div> USD </div> : <div> BRL </div>}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}