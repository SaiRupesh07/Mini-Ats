import { PrismaClient, Stage } from '@prisma/client';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main(){
 const email='demo@miniats.dev'; let user=await prisma.user.findUnique({where:{email}});
 if(!user) user=await prisma.user.create({data:{name:'Demo Recruiter',email,passwordHash:await bcrypt.hash('DemoATS2026!',12)}});
 if(await prisma.candidate.count({where:{recruiterId:user.id}})===0){
  const rows=[['Aarav Sharma','aarav.sharma@example.com','Senior Frontend Engineer','Engineering',4,['React','TypeScript','CSS'],'INTERVIEW'],['Priya Nair','priya.nair@example.com','Product Designer','Design',3,['Figma','Research','Prototyping'],'SCREENING'],['Rohan Mehta','rohan.mehta@example.com','Backend Engineer','Engineering',5,['Node.js','PostgreSQL','Docker'],'OFFER'],['Ananya Rao','ananya.rao@example.com','Data Analyst','Analytics',2,['SQL','Python','Power BI'],'APPLIED'],['Kabir Singh','kabir.singh@example.com','QA Engineer','Engineering',3,['Playwright','API Testing'],'HIRED'],['Meera Iyer','meera.iyer@example.com','ML Engineer','AI & Data',2,['Python','PyTorch','NLP'],'REJECTED'] ] as const;
  for(const [name,email,jobTitle,department,experienceYears,skills,stage] of rows){const c=await prisma.candidate.create({data:{recruiterId:user.id,name,email,jobTitle,department,experienceYears,skills,stage:stage as Stage,source:'LinkedIn',notes:'Seed candidate for local evaluation.'}}); await prisma.stageHistory.create({data:{candidateId:c.id,changedById:user.id,newStage:c.stage,note:'Initial seeded stage'}}); await prisma.candidateActivity.create({data:{candidateId:c.id,actorId:user.id,activityType:'CREATED',description:'Candidate added to the pipeline'}})}
 }
 console.log('Demo account: demo@miniats.dev / DemoATS2026!');
}
main().finally(()=>prisma.$disconnect());
