/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Utils {

    @Property()
    public nextAppointment:String

    @Property()
    public consultancyFees:Number

    @Property()
    public paymentDone:Boolean

    @Property()
    public:String



}