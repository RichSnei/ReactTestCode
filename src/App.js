import React from 'react';
import logo from './logo.svg';
import './App.css';
import OutboxButtonBar from "./OutboxButtonBar";
import OutboxDataStorage from "./OutboxDataStorage";
import Outbox from "./Outbox";
import Utils from "./utils";

import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

class App extends React.Component {
    constructor(props) {
        super(props);

        let obData = OutboxDataStorage.getOutboxData();

        obData = this.initData(obData);

        this.handleAddButton = this.handleAddButton.bind(this);
        this.handleDeleteButton = this.handleDeleteButton.bind(this);
        this.handleSendButton = this.handleSendButton.bind(this);
        this.handleObItemCheckBox = this.handleObItemCheckBox.bind(this);

        // for modal dialog
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.initModal = this.initModal.bind(this);

        this.state = {
            obItemsChecked: {},
            outboxData: obData,
            skillsConstants: OutboxDataStorage.getSkillsConstants(),
            outboxColHeaders: OutboxDataStorage.getOutboxColHeaders(),
            modalTitle: "Sigma Engineering",
            showModal: false,
            modalBodyText: "",
            modalFooterButtonText: "Close"
        };
    }

    initData(obData) {
        return obData.map((obItem) => {
            return{
                isRowChecked: false,
                obItem: obItem
            };
        });
    }

    /*************************************
     * Event Handlers
     */

    handleAddButton(event) {
        this.addItem();
        this.setState({email: event.target.value});
        event.preventDefault();
    }

    handleDeleteButton(event) {
        this.deleteItems();
        this.setState({email: event.target.value});
        event.preventDefault();
    }

    handleSendButton(event) {
        this.sendFromOutbox();
        event.preventDefault();
    }

    handleObItemCheckBox(itemId, itemChecked) {
        // have this.state.obItemsChecked only hold ids of rows that checked
        let checkedItems = this.state.obItemsChecked;
        if (checkedItems[itemId]) {
            // item is in obItemsChecked which means we think it is checked in the UI.
            // Why are we being told that the item was just checked (which shouldn't happen)
            if (itemChecked) {
                console.log('App.obItemCheckHandler: Item that was already checked passed ' + itemId)
            } else {
                delete checkedItems[itemId];
            }
        } else {
            // item isn't in objItemsCheck then it's not checked.  if it's not present, why are we getting told that the
            // check state changed to unchecked (which shouldn't happen)

            if (!itemChecked) {
                console.log('App.obItemCheckHandler: Item that was already checked passed ' + itemId)
            } else {
                checkedItems[itemId] = true;
            }
        }

        this.setState( {obItemsChecked:checkedItems});
    }

    /**************
     * Event Handler worker routines
     */
    deleteItems() {
        let checkedItemsObj = this.state.obItemsChecked;
        let checkedItems = Object.keys(checkedItemsObj);

        if (checkedItems.length === 0) {
            this.initModal( { bodyText: Utils.getStrings("DELETING_ERR_NO_SELECTED_ITEMS")});
        } else {
            let obData;
            if (OutboxDataStorage.deleteOutboxItem(checkedItems)) {
                obData = OutboxDataStorage.getOutboxData();
                obData = this.initData(obData);
                this.setState({obItemsChecked: {}});
            } else {
                console.log("error deleting items!")
            }
            this.setState({outboxData: obData});
        }
    }

    sendFromOutbox() {
        let outboxData = this.state.outboxData;
        let numCheckedItems = Object.keys(this.state.obItemsChecked).length;
        let validatedCheckedItems = [];
        let bodyText = "";

        outboxData.forEach((item => {
            let obItem = item.obItem;
            if (this.state.obItemsChecked[obItem.id] && Utils.validateEmail(obItem.email)) {
                validatedCheckedItems.push(obItem);
            }
            return true;
        }));

        if (validatedCheckedItems.length === 0) {
            bodyText = (validatedCheckedItems.length === numCheckedItems) ? "SENDING_ERR_NO_SELECTED_ITEMS" : "SENDING_ERR_NOTHING_SELECT_INVALID_EMAILS";
        } else {
            if (validatedCheckedItems.length !== numCheckedItems) {
                bodyText = "SENDING_ERR_INVALID_EMAIL";
            }

            validatedCheckedItems.forEach((obItem => {
                this.sendObItem(obItem);
                if (!OutboxDataStorage.deleteOutboxItem([obItem.id])) {
                    console.log("error deleting item '" + obItem.id + "'");
                }
            }));

            let obData = OutboxDataStorage.getOutboxData();
            obData = this.initData(obData);
            this.setState({obItemsChecked: {}, outboxData: obData});
        }

        // show alert if any errors occurred
        if (bodyText.length > 0) {
            this.initModal( { bodyText: Utils.getStrings(bodyText) });
        }
    }

    sendObItem(obItem) {
        console.log('sending item (' + obItem.id + '): ' + obItem.email );
    }

    addItem() {
        let newObItem = OutboxDataStorage.addOutboxItem('', 1);
        let obId = (newObItem) ? newObItem.id : null;
        let obData = OutboxDataStorage.getOutboxData();

        obData = this.initData(obData);
        this.setState( {outboxData: obData, focusNewItem: obId });
    }

    /*************************************
     * React Life Cycle Events
     */
    componentDidUpdate() {
        if (this.state.focusNewItem) {
            this.setState({focusNewItem: false})
        }
    }

    render() {
        let modal = (this.state.showModal) ? this.buildModal() : "";
        const headerButtonData = [
            { btnIcon: 'fa-trash-o', btnText: "Delete", btnClass: "add_delete", btnHandler: this.handleDeleteButton },
            { btnIcon: 'fa-paper-plane', btnText: 'Send', btnClass: "send", btnHandler: this.handleSendButton }];

        const footerButtonData = [
            {btnIcon: 'fa-plus-circle', btnText: "Add", btnClass: "add_delete", btnHandler: this.handleAddButton } ];

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to My React Test App</h2>
                </div>

                <OutboxButtonBar title="ReactJS Outbox" btnData={headerButtonData} />
                <Outbox skillsConstants={this.state.skillsConstants}
                        outboxData={this.state.outboxData}
                        outboxColHeaders={this.state.outboxColHeaders}
                        checkboxHandler={this.handleObItemCheckBox}
                        focusNewItem={this.state.focusNewItem}

                />
                <OutboxButtonBar buttonsFirst={true} title="ReactJS Engineering" btnData={footerButtonData} />

                {modal}
            </div>
        );
    }

    /************
     * Modal Dialog Handling code
     *
     * Call initModal with an object and the modal will be set up and launched.
     */
    initModal(modalAttributes) {
        this.setState({
            showModal: true,
            modalTitle: modalAttributes.title ? modalAttributes.title : "ReactJS Engineering",
            modalBodyText: modalAttributes.bodyText ? modalAttributes.bodyText : "",
            footerBtnText: modalAttributes.footerBtnText ? modalAttributes.footerBtnText : "Close"
        });
    }
    close() {
        this.setState({ showModal: false });
    }
    open()  {
        this.setState({ showModal: true });
    }
    buildModal() {
        return (
            <div>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <br />
                        <div dangerouslySetInnerHTML={{__html: this.state.modalBodyText}}></div>
                        <br />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>{this.state.footerBtnText}</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default App;
