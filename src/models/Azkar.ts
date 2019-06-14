import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

@Entity('azkar')
export class Azakr {
	@PrimaryGeneratedColumn()
	id!: number;

	@Index()
	@Column({ type: 'text' })
	author!: string;

	@Column()
	content!: string;

	@Column({ 'default': 0 })
	sends!: number;

	@Column({ 'type': 'timestamptz', 'default': (): string => 'now()' })
	createdAt!: Date;

	@Column({ type: 'timestamptz' })
	lastSended!: Date;

    @Index()
    @Column({ 'default': false })
	approved!: boolean;
}
