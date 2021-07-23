import { InsertResult, UpdateResult } from "typeorm";

import Report from "../model/reports";
//import User from "../model/users";
import Post from "../model/posts";
import Comment from "../model/comments";

import { newReport } from "../types/report";

import { dateFormatter } from "../lib/formatter";


//어차피 report는 운영진만 볼수 있기때문에 굳이 닉네임같은거 잡을 필요 x
//admin 기능 - 신고 리스트
export const getReportList = async (): Promise <Report[] | undefined> => {
    try {
        const reportList = await Report
            .createQueryBuilder('report')
            .select(['report.r_id', 'report.user', 'report.category', 'report.infliction', 'report.reportedDate'])
            .where('report.infliction = false')
            .getMany();

        return reportList;
    }
    catch(err) {
        //console.error(err);
        //throw new err;
    }
}

//p_id와 c_id 둘중 하나가 null일텐데... 이거 구분 어떻게 해야할까
//공통 기능 - user는 자기것만, admin은 다 가능, 신고 처리 여부 확인 가능
export const getReportDetail = async (data: number): Promise<Report | undefined> => {
    const reportId: number = data;

    try {
        const reportDetail = await Report
            .createQueryBuilder('report')
            .select(['report'])
            .where('report.r_id = :id', { id: reportId })
            .getOne();

        if(!reportDetail) throw new Error('NOt_FOUND');

        return reportDetail;
    }
    catch(err) {
        //console.error(err);
        //throw new err;
    }
}

//user 기능 - 신고 작성
export const createReport = async (data: newReport): Promise<InsertResult | undefined> => {
    const { user, type, object, ctg, rs } = data;
    let val = {};

    try {
        switch(type) {
            case "post":
                val = {
                    user: user,
                    post: object as Post,
                    comment: null,
                    category: ctg,
                    reason: rs
                };
                break;
    
            case "comment" :
                val = {
                    user: user,
                    post: null,
                    comment: object as Comment,
                    category: ctg,
                    reason: rs
                };
                break;
            
            default:
                throw new Error("WRONG_REPORT_TYPE");
                break;
        }

        const iReport: InsertResult = await Report
            .createQueryBuilder()
            .insert()
            .into(Report)
            .values(val)
            .execute()

        return iReport;
    }
    catch(err) {
        //console.error(err);
        //throw new err;
    }
}

//admin 기능 - 신고 처리 및 신고 답변 작성(?)
export const updateReport = async (data: number): Promise<UpdateResult | undefined> => {
    const reportId: number = data;
    const udate: string = dateFormatter(new Date());

    try {
        const uReport: UpdateResult = await Report
            .createQueryBuilder()
            .update(Report)
            .set({
                infliction: true,
                managedDate: udate
            })
            .where('report.r_id = :id', { id: reportId })
            .execute();

        return uReport
    }
    catch(err) {
        //console.error(err);
        //throw new err;
    }
}