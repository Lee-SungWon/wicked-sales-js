import React from 'react';

function ProductListItem(props) {
  return (
      <>
        <div className='box card-deck m-2 pointer' onClick={() => props.setView('details', { productId: props.product.productId })}>
          <div className='card-body text-center'>
            <img src={props.product.image}></img>
          </div>
          <div className='card-body'>
            <h4 className='card-text'>{props.product.name}</h4>
            <p className='card-text price'>${(props.product.price / 100).toFixed(2)}</p>
            <p className='card-text'>{props.product.shortDescription}</p>
          </div>
        </div>
      </>
    );
}

export default ProductListItem;
