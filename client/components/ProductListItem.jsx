import React from 'react';

function ProductListItem(props) {
    return (
      <>
        <div className='box'>
          <div>
            <img src={props.image}></img>
          </div>
          <div>
            <h4>{props.name}</h4>
            <p>${(props.price / 100).toFixed(2)}</p>
            <p>{props.shortDescription}</p>
          </div>
        </div>
      </>
    );
}

export default ProductListItem;
