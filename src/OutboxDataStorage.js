/**
 * Created by Rich on 4/17/2017.
 */

let lastOutboxId = 1000;
let outboxDataObj = undefined;
let outboxDataList = undefined;
let outboxDataFactory = undefined;

let _outboxDataFactory = function (){
    let hasSessionStorage = false;
    const __outboxDataSample = [
        {email: "rich@storysong.com", skill: 1},
        {email: "wingding@google.com", skill: 4},
        {email: "skydiver@yahoo.com", skill: 2},
        {email: "music@outlook.com", skill: 3},
    ];
    const __outboxIdStarter = 1000;

    function init() {
        let tempOutbox = undefined;
        let  tempLastOutboxId = undefined;

        if (typeof(Storage) !== "undefined") {
            hasSessionStorage = true;
            tempOutbox = sessionStorage.getItem("outboxData");
            tempLastOutboxId = sessionStorage.getItem("lastOutboxId");
        }

        localStorage.removeItem("outboxData");
        localStorage.removeItem("lastOutboxId");

        if (! tempOutbox) {
            tempOutbox = __outboxDataSample;
            tempLastOutboxId = __outboxIdStarter;

        } else {
            tempOutbox = JSON.parse(tempOutbox);
            tempLastOutboxId = Number(tempLastOutboxId)
        }
        lastOutboxId = tempLastOutboxId;
        outboxDataObj = undefined;

        let obObj = {};
        let list = [];

        for (let i = 0, len = tempOutbox.length; i < len; i++) {
            let obj = tempOutbox[i];
            let newObj = createObItem(obj.email, obj.skill);
            list.push(newObj);
            obObj[newObj.id] = newObj;
        }

        outboxDataObj = obObj;
        outboxDataList = list;
    }

    function saveData() {
        if (hasSessionStorage) {
            sessionStorage.setItem("outboxData", JSON.stringify(outboxDataList));
            sessionStorage.setItem("lastOutboxId", lastOutboxId.toString());
        }
    }

    function getNewOutboxId() {
        return ('u' + (++lastOutboxId));
    }

    function createObItem(email, skillId) {
        let outboxId = getNewOutboxId();

        return {
            id: outboxId,
            email: email,
            skill: skillId,

            updateskillId: function (skillId) {
                this.skill = skillId;
                outboxDataFactory.saveData();
                return this;
            },
            updateEmail: function(newEmail) {
                this.email = newEmail;
                outboxDataFactory.saveData();
                return this;
            }
        };
    }

    return {
        init: init,
        getOutboxDataList: function() {
            return outboxDataList;
        },
        getOutboxItem: function(id) {
            return outboxDataObj[id]; // return undefined if id not found;
        },
        addOutboxItem: function (email, skillId) {
            let obj = createObItem(email, skillId);
            outboxDataList.push(obj);
            outboxDataObj[obj.id] = obj;
            saveData();

            return obj;
        },

        deleteOutboxItem: function(outboxId) {
            let rc = false;
            let obj = outboxDataObj[outboxId];
            if (obj) {
                let idx = outboxDataList.indexOf(obj);
                if (idx < 0) {
                    console.log('OutboxDataStorage.deleteOutboxItem: object (' + outboxId + ') not found.');
                } else {
                    console.log('OutboxDataStorage.deleteOutboxItem: deleting object (' + outboxId + ') email: ' + obj.email);
                    outboxDataList.splice(idx, 1);
                    delete outboxDataObj[outboxId];
                    rc = true;
                }
            }
            saveData();

            return rc;
        },
        saveData: saveData
    };
};

outboxDataFactory = _outboxDataFactory();
outboxDataFactory.init();

let  OutboxDataStorage = {
    getSkillsConstants: function( ) {
        return [
            { id: 1, label: "dancing" },
            { id: 2, label: "singing" },
            { id: 3, label: "guitar playing" },
            { id: 4, label: "sky diving" },
            { id: 5, label: "pinball"}
        ];
    },

    getOutboxColHeaders: function() {
        return [
            { id: 1, label: "EMAIL" },
            { id: 2, label: "SKILL" }
        ];
    },

    getOutboxData: function() {
        return outboxDataFactory.getOutboxDataList();
    },

    addOutboxItem: function(email, skillId) {
        return outboxDataFactory.addOutboxItem(email, skillId);
    },

    deleteOutboxItem: function(outboxIds) {
        let rv = true;
        let outboxArr = (! Array.isArray(outboxIds)) ? [ outboxIds ] : outboxIds;

        for (let i=0, len=outboxArr.length; i < len; i++) {
            rv |= outboxDataFactory.deleteOutboxItem(outboxIds[i]);
        }
        return rv;
    },

    saveData: function() {
        outboxDataFactory.saveData();
    }
};



export default OutboxDataStorage