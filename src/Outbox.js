/**
 * Created by Rich on 4/17/2017.
 */
import React, { Component } from 'react';
import Utils from './utils';

let skillsConstants = undefined;

/****************
 * React Classes for handling outbox.
 */

/****************
 * OutboxRow - builds a row in the outbox.
 */
class OutboxRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.obItem,
            focusNewItem: props.focusNewItem
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSkillsChange = this.handleSkillsChange.bind(this);
        this.handleRowCheckChange = this.handleRowCheckChange.bind(this);
    }

    handleRowCheckChange(event) {
        let item = this.state.item;
        item.isRowChecked = event.target.checked;
        this.props.checkboxHandler(item.obItem.id, event.target.checked)
    }

    handleInputChange(event) {
        let item = this.state.item;

        item.obItem.updateEmail(event.target.value);
        this.setState({ item: item});
        event.preventDefault();
    }

    handleSkillsChange(event) {
        let item = this.state.item;

        item.obItem.updateSkillId(event.target.value);
        this.setState({ item: item});
        event.preventDefault();
    }

    render() {
        let item = this.state.item;
        let emailCss = Utils.validateEmail(item.obItem.email) ? "" : "invalidInput";
        let setFocus = (item.obItem.id === this.state.focusNewItem) ? "true" : null;

        return (<tr>
            <td><input type="checkbox" value={item.rowChecked} onChange={this.handleRowCheckChange}/></td>
            <td> <input type="text" className={emailCss} value={item.obItem.email}
                        onChange={this.handleInputChange} autoFocus={setFocus} placeholder="Enter an email address..."/> </td>
            <td> <select value={item.obItem.skill} onChange={this.handleSkillsChange}>
                {skillsConstants.map((skillsConstant)=>
                    <option key={skillsConstant.id} value={skillsConstant.id}>{skillsConstant.label}</option>
                )}
            </select></td>
        </tr>)
    }
}

/****************
 * OutboxBody - builds the body of the outbox by generating individual rows.
 */
class OutboxBody extends Component {
    render() {
        let obData = this.props.outboxItems;
        let data = obData.map((item) => {
            return <OutboxRow key={item.obItem.id} obItem={item} checkboxHandler={this.props.checkboxHandler} focusNewItem={this.props.focusNewItem}/>
        });

        return (
            <tbody>{ data }</tbody>
        )
    }
}

/************
 * Outbox class - Main Outbox class.  It uses the other classes to generate the outbox
 */
class Outbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            outboxColHeaders: props.outboxColHeaders,
            skillsConstants: props.skillsConstants
        };

        skillsConstants = props.skillsConstants;
    }

    render() {
        let headers =   this.state.outboxColHeaders.map((headerItem)=>
            <th key={headerItem.id}>{headerItem.label}</th>
        );
        return (
            <div className="container">
                <table id="outbox">
                    <thead>
                    <tr>
                        <th>&nbsp;</th>{headers}
                    </tr>
                    </thead>
                    <OutboxBody outboxItems={this.props.outboxData} checkboxHandler={this.props.checkboxHandler}
                                focusNewItem={this.props.focusNewItem} />
                </table>
            </div>
        )
    }
}

export default Outbox;