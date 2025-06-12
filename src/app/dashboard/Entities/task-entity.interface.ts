export interface Task {
    id: number;
    title: string;
    description: string;
    startEventDate: Date;
    endEventDate: Date;
    createdAt: Date;
    updatedAt: Date;
    priority: number;
    status: number;
    category: number;
}