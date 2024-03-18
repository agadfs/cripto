import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import styles from './coin.module.css'
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useSelector } from "react-redux";

export default function Coin() {
    const params = useParams()
    const [coin, setCoin] = useState();
    const [coinChart, setCoinChart] = useState();
    const { lang, currency } = useSelector(state => state.useroptions);
    useEffect(() => {
        const fetchCoin = async () => {
            try {
                const coindata = `https://api.coingecko.com/api/v3/coins/${params.id}`
                const response = await fetch(coindata, { method: 'GET', })
                const coinjson = await response.json()
                setCoin(coinjson)
                console.log(coinjson)

            } catch (error) {
                console.log('Failed to retrieve data: ', error)
            }
        }
        fetchCoin()
    }, [])
    return (
        <div className={styles.biggerContainer}>
            <div className={styles.coinInfoLeft} >
                <div>
                    <img src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1696501400" ></img>
                </div>
                <div style={{ fontSize: '25px', fontWeight: 'bold', fontFamily: 'sans-serif', marginRight: '20px' }} >
                    {coin?.name}
                </div >
                <div style={{ fontSize: '25px', fontWeight: 'bold', fontFamily: 'sans-serif', marginRight: '20px' }} >
                    <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }} >

                        <TrendingUpIcon />  {coin?.market_cap_rank}#
                    </div>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'sans-serif', display:'flex', gap:'5px' }} >
                    {coin?.market_data.current_price[currency]},00 {currency === 'usd' ? <div > USD</div> : <div> BRL</div>}
                </div>
            </div>
            <div className={styles.coinInfoRight} >
                <div>
                    <div>
                        {lang === 'usd' ? <div> Last 1 hour</div> :  <div> Ultima 1 hora</div>}
                        
                    </div>
                    <div style={{ color: coin?.market_data.price_change_percentage_1h_in_currency[currency] < 0 ? 'red' : 'green' }}>
                        {coin?.market_data.price_change_percentage_1h_in_currency[currency]}%
                    </div>
                </div>
                <div>
                    <div>
                    {lang === 'usd' ? <div> Last 1 hour</div> :  <div> Ultimas 24 horas</div>}
                    </div>
                    <div style={{ color: coin?.market_data.price_change_percentage_24h_in_currency[currency] < 0 ? 'red' : 'green' }}>
                        {coin?.market_data.price_change_percentage_24h_in_currency[currency]}%
                    </div>
                </div>
                <div>
                    <div>
                    {lang === 'usd' ? <div> Last 1 hour</div> :  <div> Ultimos 7 dias</div>}
                    </div>
                    <div style={{ color: coin?.market_data.price_change_percentage_7d_in_currency[currency] < 0 ? 'red' : 'green' }}>
                        {coin?.market_data.price_change_percentage_7d_in_currency[currency]}%
                    </div>
                </div>
            </div>
        </div>
    )
}