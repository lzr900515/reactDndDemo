import React, { Component } from 'react';
import Card from './Card';

class DropArea extends Component {
    constructor (props) {
        super(props);
    }

    renderCardList (cardArray) {
        // let self = this;
        let {isOverGroupBoard, delCard, setCardConfig} = this.props;
        return cardArray.map(function (item, index) {
            if ((isOverGroupBoard || !item.temp)) {
                return (
                    <Card detail={item} key={index} type={'Card'}
                          delCard={delCard}
                          setCardConfig={ (config) => {setCardConfig(item.id, config);} }
                          coordinate={[...this.props.coordinate, index]}
                          cardHoverCard={this.props.cardHoverCard}/>
                );
            } else {//当鼠标拖拽没有over groupBoard，则临时card不显示
                return null;
            }
        }, this);
    }

    render () {
        let {cardArray, style} = this.props;
        return (
            <div style={{...style, padding: '0px 10px 20px 20px'}}>
                {this.renderCardList(cardArray)}
            </div>
        );
    }
}

export default (DropArea);
