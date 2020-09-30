import React from 'react';

function ProductListItem(props) {
    return (
      <>
        <div className='box card-deck m-2'>
          <div className='card-body text-center'>
            <img src={props.image}></img>
          </div>
          <div className='card-body'>
            <h4 className='card-text'>{props.name}</h4>
            <p className='card-text'>${(props.price / 100).toFixed(2)}</p>
            <p className='card-text'>{props.shortDescription}</p>
          </div>
        </div>
      </>
    );
}

export default ProductListItem;
