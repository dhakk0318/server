const db = require('../../Config/db'); // Database connection

const RetailerBanking = {
    getBankingDetails: (retid, callback) => {
        const query = `SELECT * FROM tbl_retailer_banking WHERE retid = ?`;
        db.query(query, [retid], callback);
    },

    getAllBankingDetails: (callback) => {
        const query = `SELECT * FROM tbl_retailer_banking`;
        db.query(query, [], callback); // No parameters needed here
    },

    addBankingDetails: (data, callback) => {
        const query = `INSERT INTO tbl_retailer_banking (retid, accountno, bankname, branchname, ifsc, branchcode, accountholdername) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(query, [data.retid, data.accountno, data.bankname, data.branchname, data.ifsc, data.branchcode, data.accountholdername], callback);
    },

    updateBankingDetails: (retid, updates, callback) => {
        let query = 'UPDATE tbl_retailer_banking SET ';
        const params = [];

        for (const [key, value] of Object.entries(updates)) {
            query += `${key} = ?, `;
            params.push(value);
        }
        query = query.slice(0, -2) + ' WHERE retid = ?';
        params.push(retid);

        db.query(query, params, callback);
    },

    replaceBankingDetails: (retid, data, callback) => {
        const query = `UPDATE tbl_retailer_banking SET accountno = ?, bankname = ?, branchname = ?, ifsc = ?, branchcode = ?, accountholdername = ? WHERE retid = ?`;
        db.query(query, [data.accountno, data.bankname, data.branchname, data.ifsc, data.branchcode, data.accountholdername, retid], callback);
    }
};

module.exports = RetailerBanking;
