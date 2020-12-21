/**
 * @name IApplication
 */
export default interface IApplication<T extends any> {
    /**
     * @name main
     */
    main(): void;

    /**
     * @name shutdown
     */
    shutdown(): void;
}
