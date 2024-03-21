import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import styles from './coin.module.css'
import { useSelector } from "react-redux";
import { LineChart } from "@mui/x-charts";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

export default function Coin() {

    const params = useParams();
    const [coin, setCoin] = useState();
    const [coinChart, setCoinChart] = useState();
    const { lang, currency } = useSelector(state => state.useroptions);
    const [countdowntimer, setCountDownTimer] = useState();
    const [updatedata, setupdatedata] = useState(false);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        if (windowSize.width < 600) {

            const mobileDiv = document.querySelectorAll('#mobile');
            if (mobileDiv) {
                mobileDiv.forEach((mobileDiv) => {

                   
                    mobileDiv.style.maxHeight = '60px';
                    mobileDiv.style.fontSize = '10px';
                    mobileDiv.style.paddingTop = '0px';
                    mobileDiv.style.overflow = 'hidden';
                    mobileDiv.style.justifyContent = 'start';
                })

            }
        }
    }, []);
    useEffect(() => {
        const oldcoindata = localStorage.getItem(`oldcoindata${params.id}`)
        const oldcoindatachart = localStorage.getItem(`oldcoinchart${params.id}`)
        const fetchCoin = async () => {
            try {
                const coindata = `https://api.coingecko.com/api/v3/coins/${params.id}`
                const response = await fetch(coindata, {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json',
                        'x-cg-demo-api-key': 'CG-gSukq7hMzyfEsiiM2HS4iyA5'
                    }
                })
                const coinjson = await response.json()
                setCoin(coinjson)

                localStorage.setItem(`oldcoindata${params.id}`, JSON.stringify(coinjson))
                setupdatedata(!updatedata)
                console.log(coinjson)

            } catch (error) {
                console.log('Failed to retrieve data, trying again in 8 seconds: ', error)
                const countdownInterval = setInterval(() => {
                    setupdatedata(!updatedata)

                }, 10000);
            }
        }
        const fetchChart = async () => {
            try {
                const graphdata = `https://api.coingecko.com/api/v3/coins/${params.id}/market_chart?vs_currency=${currency}&days=30&interval=daily`
                const resdata = await fetch(graphdata, {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json',
                        'x-cg-demo-api-key': 'CG-gSukq7hMzyfEsiiM2HS4iyA5'
                    }
                })
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

            const countdownInterval = setInterval(() => {
                countdown--;
                localStorage.setItem('fetchcountdowncoin', countdown)
                setCountDownTimer(countdown)
                if (countdown <= 0) {

                    clearInterval(countdownInterval);
                    localStorage.setItem('fetchcountdowncoin', 8)
                    fetchCoin()
                    fetchChart()

                }
            }, 1000);
            return () => clearInterval(countdownInterval);
        }


    }, [updatedata])

    function ChangeHeightDefault(event) {
        if (windowSize.width < 600) {

            const clickedDiv = event.currentTarget;
            const currentMaxHeight = clickedDiv.style.maxHeight;
            const newHeight = currentMaxHeight === '60px' ? '1200px' : '60px';
           
            if(newHeight === '60px'){
                clickedDiv.style.fontSize = '10px'
    
            }else{
                clickedDiv.style.fontSize = '14px'
    
            }
            
            clickedDiv.style.maxHeight = newHeight;
        }
    }
    
    return (
        <div className={styles.biggerContainer}>
            <div className={styles.upperinfo}  >
                <div className={styles.coinInfoLeft} >
                    <div>
                        <img src={coin?.image?.small} />
                    </div>
                    <div className={styles.upperinfotext} >
                        {coin?.name}
                    </div >
                    <div className={styles.upperinfotext} >

                        <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }} >
                            {lang === 'usd' ? <div> Market Cap ({coin?.market_cap_rank}#)</div> : <div> Capitalização de mercado ({coin?.market_cap_rank}#)</div>}

                        </div>
                    </div>
                    <div className={styles.upperinfotextprice} >
                        {coin?.market_data?.current_price[currency]},00{currency === 'usd' ? <div >&nbsp;USD</div> : <div>&nbsp;BRL</div>}
                        <div style={{ display: 'flex', gap: '8px' }} >
                            <div style={{ display: 'flex', color: coin?.market_data?.price_change_percentage_24h_in_currency[currency] < 0 ? 'red' : 'green' }}>
                                {coin?.market_data?.price_change_percentage_24h_in_currency[currency] < 0 ? (
                                    <div style={{ color: 'red' }}>
                                        <ArrowDropDownIcon />
                                    </div>
                                ) : (
                                    <div style={{ color: 'green' }}>
                                        <ArrowDropUpIcon />

                                    </div>
                                )}
                                {coin?.market_data?.price_change_percentage_24h_in_currency[currency]}%
                            </div>
                        </div>
                        (24h)
                    </div>
                </div>
                <div className={styles.coinInfoRight} >

                </div>
            </div>
                <div style={{fontSize:'0px', marginBottom:'-20px', marginTop:'0px'}} id="mobile" >
                {lang === 'usd' ? <h1>Click bellow to expand  </h1> : <h1>Clique abaixo para expandir</h1>}
                </div>
            <div className={styles.infobox2} >
                <div  className={styles.infocontainer} >
                    <div id="mobile" onClick={ChangeHeightDefault} className={styles.infobox} >
                        {lang === 'usd' ? <h1>More information about {coin?.name}</h1> : <h1>Mais informações sobre {coin?.name}</h1> }
                        <div className={styles.infoboxsubinfo} >
                            {lang === 'usd' ? <p> Market Cap</p> : <p> Capitalização de mercado </p>}
                            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                                <p> {coin?.market_data?.market_cap[currency].toLocaleString('en-US')}</p> &nbsp; {currency === 'usd' ? <p> USD</p> : <p> BRL</p>}
                            </div>
                        </div>
                        <div className={styles.infoboxsubinfo} >
                            {lang === 'usd' ? <p> Fully Diluted Valuation </p> : <p> Avaliação totalmente diluída </p>}
                            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                                <p>
                                    {coin?.market_data?.fully_diluted_valuation[currency].toLocaleString('en-US')}
                                </p>
                                &nbsp; {currency === 'usd' ? <p > USD</p> : <p> BRL</p>}
                            </div>
                        </div>
                        <div className={styles.infoboxsubinfo} >
                            {lang === 'usd' ? <p> 24 Hour Trading Vol </p> : <p> Volume de negociação de 24 h </p>}
                            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                                <p>{coin?.market_data?.total_volume
                                [currency].toLocaleString('en-US')}</p> &nbsp; {currency === 'usd' ? <p> USD</p> : <p> BRL</p>}
                            </div>
                        </div>
                        <div className={styles.infoboxsubinfo} >
                            {lang === 'usd' ? <p> Circulating Supply  </p> : <p> Fornecimento circulante  </p>}
                            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                                {coin?.market_data?.circulating_supply.toLocaleString('en-US')} &nbsp;
                            </div>
                        </div>
                        <div className={styles.infoboxsubinfo} >
                            {lang === 'usd' ? <p> Total Supply </p> : <p> Fornecimento total </p>}
                            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                                {coin?.market_data?.total_supply.toLocaleString('en-US')}
                            </div>
                        </div>
                        <div className={styles.infoboxsubinfo} >
                            {lang === 'usd' ? <p> Max Supply </p> : <p> Fornecimento máx </p>}
                            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} >
                                {coin?.market_data?.max_supply ? <div>{coin?.market_data?.max_supply?.toLocaleString('en-US')} &nbsp; </div> : <div>&infin;</div>}

                            </div>
                        </div>


                    </div>


                </div>
                <div id="mobile" className={styles.priceinfo} onClick={ChangeHeightDefault}>
                    <div className={styles.priceinfotitle} >
                        {lang === 'usd' ? <p> Price variation </p> : <p> Variação do preço </p>}
                    </div>
                    <div className={styles.priceinfodiv} >
                        <div>
                            {lang === 'usd' ? <div> Last 1 hour</div> : <div> Ultima 1 hora</div>}

                        </div>
                        <div style={{ display: 'flex', color: coin?.market_data?.price_change_percentage_1h_in_currency[currency] < 0 ? 'red' : 'green' }}>
                            {coin?.market_data?.price_change_percentage_1h_in_currency[currency] < 0 ? (
                                <div style={{ color: 'red' }}>
                                    <ArrowDropDownIcon />
                                </div>
                            ) : (
                                <div style={{ color: 'green' }}>
                                    <ArrowDropUpIcon />

                                </div>
                            )}{coin?.market_data?.price_change_percentage_1h_in_currency[currency]}%
                        </div>
                    </div>
                    <div className={styles.priceinfodiv} >
                        <div>
                            {lang === 'usd' ? <div> Last 24 hours</div> : <div> Ultimas 24 horas</div>}
                        </div>
                        <div style={{ display: 'flex', color: coin?.market_data?.price_change_percentage_24h_in_currency[currency] < 0 ? 'red' : 'green' }}>
                            {coin?.market_data?.price_change_percentage_24h_in_currency[currency] < 0 ? (
                                <div style={{ color: 'red' }}>
                                    <ArrowDropDownIcon />
                                </div>
                            ) : (
                                <div style={{ color: 'green' }}>
                                    <ArrowDropUpIcon />

                                </div>
                            )}
                            {coin?.market_data?.price_change_percentage_24h_in_currency[currency]}%
                        </div>
                    </div>
                    <div className={styles.priceinfodiv}>
                        <div>
                            {lang === 'usd' ? <div> Last 7 days</div> : <div> Ultimos 7 dias</div>}
                        </div>
                        <div style={{ display: 'flex', color: coin?.market_data?.price_change_percentage_7d_in_currency[currency] < 0 ? 'red' : 'green' }}>

                            {coin?.market_data?.price_change_percentage_7d_in_currency[currency] < 0 ? (
                                <div style={{ color: 'red' }}>
                                    <ArrowDropDownIcon />
                                </div>
                            ) : (
                                <div style={{ color: 'green' }}>
                                    <ArrowDropUpIcon />

                                </div>
                            )}{coin?.market_data?.price_change_percentage_7d_in_currency[currency]}%
                        </div>
                    </div>
                    <div className={styles.priceinfodiv}>
                        <div>
                            {lang === 'usd' ? <div> Last 30 days</div> : <div> Ultimos 30 dias</div>}
                        </div>
                        <div style={{ display: 'flex', color: coin?.market_data?.price_change_percentage_30d_in_currency[currency] < 0 ? 'red' : 'green' }}>
                            {coin?.market_data?.price_change_percentage_30d_in_currency[currency] < 0 ? (
                                <div style={{ color: 'red' }}>
                                    <ArrowDropDownIcon />
                                </div>
                            ) : (
                                <div style={{ color: 'green' }}>
                                    <ArrowDropUpIcon />

                                </div>
                            )}{coin?.market_data?.price_change_percentage_30d_in_currency[currency]}%
                        </div>
                    </div>
                    <div className={styles.priceinfodiv}>
                        <div>
                            {lang === 'usd' ? <div> Last 60 days</div> : <div> Ultimos 60 dias</div>}
                        </div>
                        <div style={{ display: 'flex', color: coin?.market_data?.price_change_percentage_60d_in_currency[currency] < 0 ? 'red' : 'green' }}>
                            {coin?.market_data?.price_change_percentage_60d_in_currency[currency] < 0 ? (
                                <div style={{ color: 'red' }}>
                                    <ArrowDropDownIcon />
                                </div>
                            ) : (
                                <div style={{ color: 'green' }}>
                                    <ArrowDropUpIcon />

                                </div>
                            )}{coin?.market_data?.price_change_percentage_60d_in_currency[currency]}%
                        </div>
                    </div>
                    <div className={styles.priceinfodiv}>
                        <div>
                            {lang === 'usd' ? <div> Last 200 days</div> : <div> Ultimos 200 dias</div>}
                        </div>
                        <div style={{ display: 'flex', color: coin?.market_data?.price_change_percentage_200d_in_currency[currency] < 0 ? 'red' : 'green' }}>
                            {coin?.market_data?.price_change_percentage_200d_in_currency[currency] < 0 ? (
                                <div style={{ color: 'red' }}>
                                    <ArrowDropDownIcon />
                                </div>
                            ) : (
                                <div style={{ color: 'green' }}>
                                    <ArrowDropUpIcon />

                                </div>
                            )}{coin?.market_data?.price_change_percentage_200d_in_currency[currency]}%
                        </div>
                    </div>
                    <div className={styles.priceinfodiv}>
                        <div>
                            {lang === 'usd' ? <div> Last year </div> : <div> Ultimo ano </div>}
                        </div>
                        <div style={{ display: 'flex', color: coin?.market_data?.price_change_percentage_1y_in_currency[currency] < 0 ? 'red' : 'green' }}>
                            {coin?.market_data?.price_change_percentage_1y_in_currency[currency] < 0 ? (
                                <div style={{ color: 'red' }}>
                                    <ArrowDropDownIcon />
                                </div>
                            ) : (
                                <div style={{ color: 'green' }}>
                                    <ArrowDropUpIcon />

                                </div>
                            )}{coin?.market_data?.price_change_percentage_1y_in_currency[currency]}%
                        </div>
                    </div>
                </div>



                <div id="mobile" className={styles.chartbody} onClick={ChangeHeightDefault} >
                    {lang === 'usd' ? <h1>Price fluctuation Graph (30d)</h1> : <h1>Gráfico de Flutuação do preço (30d)</h1>}
                    <div  >

                        {coinChart ?
                            <div className={styles.chartgraph}  >
                                <LineChart
                                    xAxis={[{ data: Array.from({ length: coinChart.prices.length }, (_, index) => index + 1) }]}
                                    series={[
                                        {
                                            data: coinChart.prices.map(entry => entry[1]),
                                            showMark: false,
                                            valueFormatter: (value => value + (currency === 'usd' ? ' USD' : ' BRL'))
                                        },
                                    ]}
                                    margin={{ left: 115, right: 10 }}
                                    sx={{
                                        //change left yAxis label styles
                                        "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                                            strokeWidth: "1",
                                            fill: "white"
                                        },
                                        // change all labels fontFamily shown on both xAxis and yAxis
                                        "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel": {
                                            fontFamily: "sans-serif",
                                        },
                                        // change bottom label styles
                                        "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                                            strokeWidth: "1",
                                            fill: "white"
                                        },
                                        // bottomAxis Line Styles
                                        "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
                                            stroke: "white",
                                            strokeWidth: 1
                                        },
                                        // leftAxis Line Styles
                                        "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                                            stroke: "white",
                                            strokeWidth: 1
                                        }
                                    }}
                                />


                            </div> :

                            <div>Loading Graph</div>}

                    </div>
                </div>

            </div>
            <div className={styles.infobox2}>
                <div id="mobile" onClick={ChangeHeightDefault} className={styles.aboutbox} >
                    <div>

                        {lang === 'usd' ? <h1>About the {coin?.name}</h1> : <h1>Sobre a moeda {coin?.name}</h1>}
                        {lang === 'usd' ? null : <p>OBS: Caso o texto não exista em português, será usado a lingua inglesa(en). </p>}
                    </div>
                    {coin?.description?.[lang] ? <div dangerouslySetInnerHTML={{ __html: coin?.description?.[lang] }}></div>
                        : <div dangerouslySetInnerHTML={{ __html: coin?.description?.en }}></div>}

                </div>
                <div id="mobile" onClick={ChangeHeightDefault} className={styles.chartbody} >

                    {lang === 'usd' ? <h1>Market Cap fluctuation (30d)</h1> : <h1>Flutuação da capitalização de mercado (30d)</h1>}
                    <div   >

                        {coinChart ?
                            <div id="mobile" onClick={ChangeHeightDefault} className={styles.chartgraph} >
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
                                    sx={{
                                        //change left yAxis label styles
                                        "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
                                            strokeWidth: "0.4",
                                            fill: "white"
                                        },
                                        // change all labels fontFamily shown on both xAxis and yAxis
                                        "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel": {
                                            fontFamily: "sans-serif",
                                        },
                                        // change bottom label styles
                                        "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
                                            strokeWidth: "0.5",
                                            fill: "white"
                                        },
                                        // bottomAxis Line Styles
                                        "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
                                            stroke: "white",
                                            strokeWidth: 1
                                        },
                                        // leftAxis Line Styles
                                        "& .MuiChartsAxis-left .MuiChartsAxis-line": {
                                            stroke: "white",
                                            strokeWidth: 1
                                        }
                                    }}
                                />
                            </div> :
                            <div>
                                Loading Graph
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}