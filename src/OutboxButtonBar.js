/**
 * Created by Rich on 4/16/2017.
 */
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';


class OutboxButton extends Component {
    constructor(props) {
        super(props);
        this.handleBtnClick= this.handleBtnClick.bind(this);

        this.state = {btnLabel: props.btnLabel, btnClass: props.btnClass, btnIcon: props.btnIcon };
    }

    handleBtnClick(e) {
        (this.props.btnHandler)(e);
    }

    render() {
        return (
            <Button onClick={this.handleBtnClick} className={this.state.btnClass}>
                <i className={"fa " + this.state.btnIcon} />  { this.state.btnLabel }
            </Button>
        );
    }
}

class OutboxButtonBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            btnData: props.btnData,
            buttonsFirst: (props.buttonsFirst ? props.buttonsFirst : false) };
    }

    render() {
        const buttons = this.state.btnData.map((btnSpec) =>
            <OutboxButton key={btnSpec.btnText}
                          btnIcon={btnSpec.btnIcon}
                          btnLabel={btnSpec.btnText}
                          btnClass={btnSpec.btnClass}
                          btnHandler={btnSpec.btnHandler}
            />
        );

        let markup;

        if (this.state.buttonsFirst) {
            markup = (<div>
                <div className="col-xs-5 text-left">{buttons}</div>
                <div className="col-xs-7 outboxLabel text-right">{this.state.title}</div>
            </div>)
        } else {
            markup = (<div>
                <div className="col-xs-7 outboxLabel">{this.state.title}</div>
                <div className="col-xs-5 text-right">{buttons}</div>
            </div>)
        }

        return (
            <div className="container outboxButtonBar">
                <div id="" className="row">
                    {markup}
                </div>
            </div>
        );
    }
}

export default OutboxButtonBar;