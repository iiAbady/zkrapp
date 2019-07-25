import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
	@PrimaryColumn({ type: 'text' })
	public token!: string;

    @Index()
    @Column({ type: 'text' })
	public token_secert!: string;
}
