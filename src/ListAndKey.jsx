<<<<<<< HEAD
import React from 'react'

function NumberList(){
    const numberList = [1,2,3,4,5,6];
    numberList.push(7);
    const list = numberList.map((number)=>
        <li key={number.toString()}>{number}</li>
    );
    return <ul>{list}</ul>
}

=======
import React from 'react'

function NumberList(){
    const numberList = [1,2,3,4,5,6];
    numberList.push(7);
    const list = numberList.map((number)=>
        <li key={number.toString()}>{number}</li>
    );
    return <ul>{list}</ul>
}

>>>>>>> add new code
export default NumberList