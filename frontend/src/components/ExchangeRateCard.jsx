import api from "../api";
import '../styles/exchangeratecard.css'
import { useEffect, useState } from "react";

function ExchangeRateCard() {
    const [rates, setRates] = useState(null);

    useEffect(() => {
        const fetchExchangeRates = async () => {
            const res = await api.get('/finance/exchange-rate-card/');
            setRates(res.data);
        };

        fetchExchangeRates();
    }, []);

    return (
        <div className="card exchange-rate">
            {!rates ? (
                <p>Loading...</p>
            ) : (<>
                    <div className="header">
                        <h2 className="erica-site-heading">{rates.base.currency_code}</h2>
                        <p className="site-p">{rates.base.name}</p>
                    </div>
                    {rates.rates.length > 0 ?
                        (<ul className="watched-currencies">
                            {rates.rates.map((pairing, index) => (
                                <li className="watched-currency" key={index}>
                                    <h3 className="erica-site-heading">
                                        {pairing.code}
                                        <span>{pairing.name}</span>
                                    </h3>
                                    <p className="site-p exchange-rate-value">
                                        {Math.round(pairing.value * 100) / 100}
                                    </p>
                                </li>
                            ))}
                        </ul>)
                        :
                        (
                        <div className="watched-currencies empty">
                            <h4 className="site-header">
                                Money isn't real anyway...
                            </h4>
                            <p className="site-p">
                                Once you've picked exchange rates to watch, they'll appear here
                            </p>
                            <button className="erica-site-btn primary">
                                Add rates
                            </button>
                        </div>
                        )
                    }
                </>
            )}
        </div>
    );
}

export default ExchangeRateCard;