import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import styles from './coin.module.css'
import { useSelector } from "react-redux";
import { LineChart } from "@mui/x-charts";

/* coisas que tentei implementar:

HISTORIA SOBRE A MOEDA: Na API CoinGecko não encontrei a descrição ou historia sobre a moeda,
teria que buscar outra api ou banco de dados para poder ter as historias sobre as moedas

O gráfico eu teria feito interativo para mudar quantos dias de intervalo o usuário gostaria de ver

*/

export default function Coin() {
    const params = useParams();
    const [coin, setCoin] = useState();
    const [coinChart, setCoinChart] = useState();
    const { lang, currency } = useSelector(state => state.useroptions);
    const [countdowntimer, setCountDownTimer] = useState();
    const [updatedata, setupdatedata] = useState(false);
    useEffect(() => {
        const oldcoindata = localStorage.getItem(`oldcoindata${params.id}`)
        const oldcoindatachart = localStorage.getItem(`oldcoinchart${params.id}`)
        
        const fetchCoin = async () => {
            try {
                const coindata = `https://api.coingecko.com/api/v3/coins/${params.id}`
                const response = await fetch(coindata, { method: 'GET', })
                const coinjson = await response.json()
                setCoin(coinjson)
                
                localStorage.setItem(`oldcoindata${params.id}`, JSON.stringify(coinjson))
                setupdatedata(!updatedata)

            } catch (error) {
                console.log('Failed to retrieve data, trying again in 10 seconds: ', error)
                const countdownInterval = setInterval(() => {
                    setupdatedata(!updatedata)
                    
                }, 10000);
            }
        }
        const fetchChart = async () => {
            try {
                const graphdata = `https://api.coingecko.com/api/v3/coins/${params.id}/market_chart?vs_currency=${currency}&days=30&interval=daily`
                const resdata = await fetch(graphdata, { method: 'GET',  })
                const chartjson = await resdata.json()
                localStorage.setItem(`oldcoinchart${params.id}`, JSON.stringify(chartjson))
                setCoinChart(chartjson)
                

            }
            catch (error) {
                console.log('Failed to retrieve graph data: ', error)
            }
        }
        if (!oldcoindata) {
              fetchCoin()
            fetchChart()  
            console.log('Getting coin data...')
            
        } else {
            setCoin(JSON.parse(oldcoindata))
            setCoinChart(JSON.parse(oldcoindatachart))
            let countdown = localStorage.getItem('fetchcountdowncoin');
            console.log(`Using old data, please wait ${countdown} second for new coin data`)
            const countdownInterval = setInterval(() => {
                countdown--;
                localStorage.setItem('fetchcountdowncoin', countdown)
                setCountDownTimer(countdown)
                if (countdown <= 0) {

                    clearInterval(countdownInterval);
                    localStorage.setItem('fetchcountdowncoin', 20)
                    fetchCoin()
                    fetchChart()
                    
                }
            }, 1000);
            return () => clearInterval(countdownInterval);
        }
        
       
    }, [updatedata])
   

    return (
        <div className={styles.biggerContainer}>
            <div className={styles.upperinfo}  >
                <div className={styles.coinInfoLeft} >
                    <div>
                        <img src={coin?.image?.small} />
                    </div>
                    <div style={{ fontSize: '25px', fontWeight: 'bold', fontFamily: 'sans-serif', marginRight: '20px' }} >
                        {coin?.name}
                    </div >
                    <div style={{ fontSize: '25px', fontWeight: 'bold', fontFamily: 'sans-serif', marginRight: '20px' }} >
                        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }} >
                            {lang === 'usd' ? <div> Market Cap Ranking ({coin?.market_cap_rank}#)</div> : <div> Ranking de capitalização de mercado ({coin?.market_cap_rank}#)</div>}

                        </div>
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'sans-serif', display: 'flex', gap: '5px' }} >
                        {coin?.market_data?.current_price[currency]},00 {currency === 'usd' ? <div > USD</div> : <div> BRL</div>}
                    </div>
                </div>
                <div className={styles.coinInfoRight} >

                </div>
            </div>
            <div className={styles.middleinfo} >
                <div style={{ width: '40%', display: 'flex', flexDirection: 'column' }} >
                    <div style={{ fontSize: '16px', display: 'flex', gap: '30px' }} >
                        {lang === 'usd' ? <h3> Market Cap</h3> : <h3> Capitalização de mercado </h3>}
                        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                            {coin?.market_data?.market_cap[currency].toLocaleString('en-US')} &nbsp; {currency === 'usd' ? <p > USD</p> : <p> BRL</p>}
                        </div>
                    </div>
                    <div style={{ fontSize: '16px', display: 'flex', gap: '30px' }} >
                        {lang === 'usd' ? <h3> Fully Diluted Valuation </h3> : <h3> Avaliação totalmente diluída </h3>}
                        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                            {coin?.market_data?.fully_diluted_valuation[currency].toLocaleString('en-US')} &nbsp; {currency === 'usd' ? <p > USD</p> : <p> BRL</p>}
                        </div>
                    </div>
                    <div style={{ fontSize: '16px', display: 'flex', gap: '30px' }} >
                        {lang === 'usd' ? <h3> 24 Hour Trading Vol </h3> : <h3> Volume de negociação de 24 h </h3>}
                        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                            {coin?.market_data?.total_volume
                            [currency].toLocaleString('en-US')} &nbsp; {currency === 'usd' ? <p > USD</p> : <p> BRL</p>}
                        </div>
                    </div>
                    <div style={{ fontSize: '16px', display: 'flex', gap: '30px' }} >
                        {lang === 'usd' ? <h3> Circulating Supply  </h3> : <h3> Fornecimento circulante  </h3>}
                        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                            {coin?.market_data?.circulating_supply.toLocaleString('en-US')} &nbsp;
                        </div>
                    </div>
                    <div style={{ fontSize: '16px', display: 'flex', gap: '30px' }} >
                        {lang === 'usd' ? <h3> Total Supply </h3> : <h3> Fornecimento total </h3>}
                        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                            {coin?.market_data?.total_supply.toLocaleString('en-US')}
                        </div>
                    </div>
                    <div style={{ fontSize: '16px', display: 'flex', gap: '30px' }} >
                        {lang === 'usd' ? <h3> Max Supply </h3> : <h3> Fornecimento máx </h3>}
                        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                            {coin?.market_data?.max_supply ? <div>{coin?.market_data?.max_supply?.toLocaleString('en-US')} &nbsp; </div> : <div>&infin;</div>}
                            
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '24px', gap:'20px', marginTop:'50px' }}>
                        <div>
                        {lang === 'usd' ? <h3> Price variation </h3> : <h3> Variação do preço </h3>}
                        </div>
                        <div style={{display:'flex', gap: '8px'}} >
                            <div>
                                {lang === 'usd' ? <div> Last 1 hour</div> : <div> Ultima 1 hora</div>}

                            </div>
                            <div style={{ color: coin?.market_data?.price_change_percentage_1h_in_currency[currency] < 0 ? 'red' : 'green' }}>
                                {coin?.market_data?.price_change_percentage_1h_in_currency[currency]}%
                            </div>
                        </div>
                        <div style={{display:'flex', gap: '8px'}} >
                            <div>
                                {lang === 'usd' ? <div> Last 24 hours</div> : <div> Ultimas 24 horas</div>}
                            </div>
                            <div style={{ color: coin?.market_data?.price_change_percentage_24h_in_currency[currency] < 0 ? 'red' : 'green' }}>
                                {coin?.market_data?.price_change_percentage_24h_in_currency[currency]}%
                            </div>
                        </div>
                        <div style={{display:'flex', gap: '8px'}}>
                            <div>
                                {lang === 'usd' ? <div> Last 7 days</div> : <div> Ultimos 7 dias</div>}
                            </div>
                            <div style={{ color: coin?.market_data?.price_change_percentage_7d_in_currency[currency] < 0 ? 'red' : 'green' }}>
                                {coin?.market_data?.price_change_percentage_7d_in_currency[currency]}%
                            </div>
                        </div>
                        <div style={{display:'flex', gap: '8px'}}>
                            <div>
                                {lang === 'usd' ? <div> Last 30 days</div> : <div> Ultimos 30 dias</div>}
                            </div>
                            <div style={{ color: coin?.market_data?.price_change_percentage_30d_in_currency[currency] < 0 ? 'red' : 'green' }}>
                                {coin?.market_data?.price_change_percentage_30d_in_currency[currency]}%
                            </div>
                        </div>
                        <div style={{display:'flex', gap: '8px'}}>
                            <div>
                                {lang === 'usd' ? <div> Last 60 days</div> : <div> Ultimos 60 dias</div>}
                            </div>
                            <div style={{ color: coin?.market_data?.price_change_percentage_60d_in_currency[currency] < 0 ? 'red' : 'green' }}>
                                {coin?.market_data?.price_change_percentage_60d_in_currency[currency]}%
                            </div>
                        </div>
                        <div style={{display:'flex', gap: '9px'}}>
                            <div>
                                {lang === 'usd' ? <div> Last 200 days</div> : <div> Ultimos 200 dias</div>}
                            </div>
                            <div style={{ color: coin?.market_data?.price_change_percentage_200d_in_currency[currency] < 0 ? 'red' : 'green' }}>
                                {coin?.market_data?.price_change_percentage_200d_in_currency[currency]}%
                            </div>
                        </div>
                        <div style={{display:'flex', gap: '8px'}}>
                            <div>
                                {lang === 'usd' ? <div> Last year </div> : <div> Ultimo ano </div>}
                            </div>
                            <div style={{ color: coin?.market_data?.price_change_percentage_1y_in_currency[currency] < 0 ? 'red' : 'green' }}>
                                {coin?.market_data?.price_change_percentage_1y_in_currency[currency]}%
                            </div>
                        </div>
                    </div>

                </div>
                <div style={{ width: '60%' }} >
                    <div className={styles.chartbody} >
                        {lang === 'usd' ? <h1>Price fluctuation (30d)</h1> : <h1>Flutuação do preço (30d)</h1>}
                        <div className={styles.chartgraph}  >

                            {coinChart ?
                                <div style={{ width: '390px', height: '360px' }} >
                                    <LineChart
                                        xAxis={[{ data: Array.from({ length: coinChart.prices.length }, (_, index) => index + 1) }]}
                                        series={[
                                            {
                                                data: coinChart.prices.map(entry => entry[1]),
                                                showMark: false,
                                                valueFormatter: (value => value + (currency === 'usd' ? ' USD' : ' BRL'))
                                            },
                                        ]}

                                        sx={{ paddingBlock: '10px' }}
                                    />


                                </div> :

                                <div>Loading Graph</div>}

                        </div>
                    </div>
                    <div className={styles.chartbody} >
                        {lang === 'usd' ? <h1>Market Cap fluctuation (30d)</h1> : <h1>Flutuação da capitalização de mercado (30d)</h1>}
                        <div className={styles.chartgraph}  >

                            {coinChart ?
                                <div style={{ width: '390px', height: '360px' }} >
                                    <LineChart
                                        xAxis={[{ data: Array.from({ length: coinChart.market_caps.length }, (_, index) => index + 1) }]}
                                        series={[
                                            {
                                                data: coinChart.market_caps.map(entry => {
                                                    let value = entry[1]
                                                    return value
                                                }),
                                                showMark: false,
                                                valueFormatter: (value => value + (currency === 'usd' ? ' USD' : ' BRL'))
                                            },
                                        ]}
                                        margin={{ left: 115, right: 10 }}

                                    />
                                </div> :
                                <div>Loading Graph</div>}

                        </div>
                    </div>




                </div>



            </div>
        </div>
    )
}