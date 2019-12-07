/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Ehr } from './ehr';
import { Symptoms } from './properties/Symptoms';
import { Bloodtest } from './properties/BloodTest';
import { Utils } from './properties/Util';

@Info({title: 'EhrContract', description: 'My Smart Contract' })
export class EhrContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async ehrExists(ctx: Context, ehrId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(ehrId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createEhr(ctx: Context, ehrId: string, symptoms:Symptoms, anyotherproblem:string, bloodtest:Bloodtest, medicine:string,util:Utils,feedback:string, doctorID: string, patientID:string): Promise<void> {
        const exists = await this.ehrExists(ctx, ehrId);
        if (exists) {
            throw new Error(`The ehr ${ehrId} already exists`);
        }
        const ehr = new Ehr();
        ehr.doctorID=doctorID;
        ehr.patientID=patientID;
        ehr.Symptoms=symptoms;
        ehr.anyOtherProblem=anyotherproblem;
        ehr.bloodtest=bloodtest;
        ehr.medicines=medicine;
        ehr.util=util;
        ehr.patientFeedback=feedback;
        const buffer = Buffer.from(JSON.stringify(ehr));
        await ctx.stub.putState(ehrId, buffer);
    }

    @Transaction(false)
    @Returns('Ehr')
    public async readEhr(ctx: Context, ehrId: string): Promise<Ehr> {
        const exists = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        const buffer = await ctx.stub.getState(ehrId);
        const ehr = JSON.parse(buffer.toString()) as Ehr;
        return ehr;
    }

    @Transaction()
    public async updateEhr(ctx: Context, ehrId: string, newValue: string): Promise<void> {
        const exists = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        const ehr = new Ehr();
        
        const buffer = Buffer.from(JSON.stringify(ehr));
        await ctx.stub.putState(ehrId, buffer);
    }

    @Transaction()
    public async deleteEhr(ctx: Context, ehrId: string): Promise<void> {
        const exists = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        await ctx.stub.deleteState(ehrId);
    }

    @Transaction()
    public async updateDoctorOnEhr(ctx: Context, ehrId: string, doctorID:string): Promise<void> {
        const exists = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        const ehr = new Ehr();
        ehr.doctorID = doctorID;
        const buffer = Buffer.from(JSON.stringify(ehr));
        await ctx.stub.putState(ehrId, buffer);
    }


}