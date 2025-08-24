import { User } from "src/auth/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column()
    authorName: string;

    @ManyToOne(() => User, (user) => user.posts)
    author: User;

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}