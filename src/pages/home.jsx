
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";

export default function Home() {
   
    const [coinsdata, setCoinsData] = useState([]);
    const { lang, currency } = useSelector(state => state.useroptions);
    const [currencystate, setcurrencystate] = useState();
    useEffect(() => {
        /* FOI NECESSARIO ADICINAR UM COUNTDOWN E GUARDAR LISTA DE MOEDAS, POIS A API NAO ACEITA MUITAS REQUISIÇÕES EM POUCO TEMPO. 
        PORTANTO, ESSE UseEffect , ATUALIZA AS INFORMAÇÕES A CADA 20 SEGUNDOS QUE O APP/SITE ESTIVER ABERTO */
        const oldcoinsarray = localStorage.getItem('coinsarray')
        const fetchCoins = async () => {
            try {
                const coinsdata = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en`
                const response = await fetch(coinsdata, { method: 'GET', })
                const coins = await response.json()
                localStorage.setItem('coinsarray', JSON.stringify(coins));
                setCoinsData(coins)
                console.log('Coins data updated')
                setcurrencystate(currency)

            } catch (error) {
                console.log('Failed to retrieve data: ', error)
            }
        }
        if (!oldcoinsarray) {
            fetchCoins()
            console.log('Old data DONT EXIST, getting coins data NOW')
        } else {
            setCoinsData(JSON.parse(oldcoinsarray));
           
            let countdown = localStorage.getItem('fetchcountdown');
            console.log(`Using old data, please wait ${countdown} second for new coin data`)
            const countdownInterval = setInterval(() => {
                countdown--;
                localStorage.setItem('fetchcountdown', countdown)

                if (countdown <= 0) {

                    clearInterval(countdownInterval);
                    localStorage.setItem('fetchcountdown', 20)
                    fetchCoins();
                }
            }, 1000);
            return () => clearInterval(countdownInterval);
        }
    }, [currency]);
   
    return (
        <div>
            
            {coinsdata?.map(coins => {
                return (
                    <div onClick={() => {
                        window.location.href=`/${coins.id}`
                    }} style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }} key={coins.id}>
                        <div  >
                            <img style={{ width: '35px', height: '35px' }} src={coins.image} />
                        </div>
                        <div> {coins.name} </div>
                        <div style={{display:'flex', gap:'5px'}}  > {coins.current_price},00 {currencystate === 'usd' ? <div> USD </div> : <div> BRL </div>}</div>
                    </div>
                )
            })}

        </div>
    )
}