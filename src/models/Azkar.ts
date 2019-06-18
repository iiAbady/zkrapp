import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

@Entity('azkar')
export class Azakr {
	@PrimaryColumn()
	content!: string;

	@Column({ 'default': 0 })
	sends!: number;

	@Column({ 'type': 'timestamptz', 'default': (): string => 'now()' })
	createdAt!: Date;

	@Column({ type: 'timestamptz', nullable: true })
	last_sent!: Date;

    @Index()
    @Column({ 'default': false })
	approved!: boolean;
}
