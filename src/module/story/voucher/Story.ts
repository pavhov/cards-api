import VoucherTask from "../../repository/voucher/Task";

/**
 * @name Story
 */
export default class Story {
    /**
     * @name tasks
     */
    public tasks: {
        Voucher: VoucherTask;
    };

    /**
     * @name Story
     */
    public constructor() {
        this.tasks = {
            Voucher: VoucherTask.Instance(),
        };
    }

}
