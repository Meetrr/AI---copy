import { useEffect } from "react";

const Dummy = () => {

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://192.168.1.81:5000/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input_string: 'hello' })
            })
            const responseJson = await response.json();

            // const newArray = new Array(responseJson.Categories[2]);
            // const array = [];
            // for ( var i=0; i<responseJson.Categories.length; i++ ) {
            //     array.push(parseFloat(responseJson.Categories[i][2]));
            // }

            // console.log(responseJson.Categories.slice().sort((a, b) => b[2] - a[2]));

        };
        fetchData();
    }, [])

  return (
    <>
    
    </>
  )
}

export default Dummy;