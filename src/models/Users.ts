import { Entity, Column, Index, PrimaryColumn } from 'typeorm';

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

@Entity('users')
export class User {
	@PrimaryColumn({ type: 'text' })
	token!: string;

    @Index()
    @Column({ type: 'text' })
	token_secert!: string;
}
