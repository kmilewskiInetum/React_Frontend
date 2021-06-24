import React, {useEffect, useState} from 'react';
import './App.css';

const App = () => {

    const API_CART = "api/cart";
    const API_CHECK = "/api/product/check";
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch(API_CART)
            .then(res => res.json())
            .then(
                (result) => {
                    result.forEach(product => product.quantity = 1);
                    setCart(result);
                },
                (error) => console.error(error)
            )
    }, [])

    const countSum = (cart) => {
        if(cart.length)
        return cart
            .map(product => Number(product.price) * product.quantity)
            .reduce((accumulator, current) => accumulator + current)
            .toFixed(2)
        else
            return 0
    }

    const increase = (index) => {
        const newCart = [...cart];
        newCart[index].quantity++;
        setCart(newCart);
        checkCart(index);
    }

    const decrease = (index) => {
        const newCart = [...cart];
        newCart[index].quantity--;
        setCart(newCart);
        checkCart(index);
    }

    const checkCart = (index) => {
        const body = cart[index];
        fetch(API_CHECK,
            {method: 'POST', body: JSON.stringify(body)})
            .then(res => res.json())
            .then(res => { 
                if(res.isError && res.errorType === 'INCORRECT_QUANTITY') {
                    const newCart = [...cart];
                    newCart[index].quantity = newCart[index].min;
                    setCart(newCart);
                }
            })

    }

    return (
        <div className="container">
            <h3>Lista produktów</h3>
            <ul>
                {cart.map((item,index) => (
                    <li className="row" key={item.id}>
                        {item.name}, cena: {item.price.toLocaleString()}zł
                        <CounterComponent min={item.min} max={item.max} isBlocked={item.isBlocked} decrease={() => decrease(index)} increase={() => increase(index)} quantity={item.quantity} />
                    </li>
                ))}
            </ul>
            <div>Suma produktów: {countSum(cart)}zł </div>

        </div>
    );
};

const CounterComponent = (props) => {
    const {min, max, isBlocked = false, decrease, increase, quantity} = props;
    return <div>
        <button disabled={isBlocked || quantity <= min} onClick={decrease}> - </button>
        <button disabled={isBlocked || quantity >= max} onClick={increase}> + </button>
        Obecnie masz {quantity} sztuk produktu
    </div>;
}

export {
    App
};
