class Pool {
    size: number;
    available: number;
    tasks: any[];
    resolves: any[];
    results: any[];

    constructor(size: number) {
        this.size = size;
    }

    push(task: { (): Promise<void>; (): any }) {
        this.tasks.push(async () => task());
    }

    async go() {
        const tasks = [];
        for (let i = 0; i < this.tasks.length; i++) {
            await this.isAvailable();
            tasks.push(
                this.tasks[i]().then((res: any) => {
                    this.results[i] = res;
                    if (this.resolves.length > 0) this.resolves.shift()(false);
                }),
            );
        }
        await Promise.all(tasks);
        return this.results;
    }

    isAvailable(): Promise<boolean> {
        return new Promise((resolve) => {
            if (this.available > 0) {
                this.available--;
                resolve(true);
            } else this.resolves.push(resolve);
        });
    }
}

export default Pool;
