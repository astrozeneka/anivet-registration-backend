import BaseCrudDAO from "./BaseCrudDAO";

class SampleParcelDAO extends BaseCrudDAO{
    static instance = null;
    static getInstance(){
        if(this.instance == null) {
            this.instance = new SampleParcelDAO()
        }
        return this.instance
    }
    static tearDown(){
        this.instance = null;
    }

    name = "sampleParcel"
    async buildTable(){
        await sqlExecute("" +
            "CREATE TABLE `sampleParcel` (" +
            "   sampleParcel_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
            "   sampleParcel_reference VARCHAR(255)," +
            "   sampleParcel_deliveryService VARCHAR(255)," +
            "   sampleParcel_testSampleId INT(6) UNSIGNED," +
            "   sampleParcel_triggererId INT(6) UNSIGNED," +
            "   sampleParcel_date DATETIME," +
            "   sampleParcel_file LONGBLOB," +
            "" +
            "   CONSTRAINT `fk_sampleParcel_testSampleId` FOREIGN KEY (sampleParcel_testSampleId) REFERENCES testSample (testSample_id) ON DELETE CASCADE," +
            "   CONSTRAINT `fk_sampleParcel_triggererId` FOREIGN KEY (sampleParcel_triggererId) REFERENCES baseMember (baseMember_id) ON DELETE CASCADE" +
            ")" +
            "ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;;",)

        /**
         * Build views
         */
        await sqlExecute("" +
            "CREATE VIEW `sampleParcel_` AS" +
            "   SELECT * FROM `sampleParcel`")
        await sqlExecute("" +
            "CREATE VIEW `sampleParcel_edit` AS" +
            "   SELECT * FROM `sampleParcel`")

    }
}
