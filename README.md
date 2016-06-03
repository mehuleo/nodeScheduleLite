# nodeScheduleLite
A Light weight Node.js scheduler

Not much to learn:  
- Edit port in index.js, on which you want node server to run  
- Make sure the config.json file contains '[]', initially  
- Start server by running `npm start`
- Request formate: `http://localhost:3005/?cmd=pwd&fireTime=2016-06-03%2020:30:30&name=test3`  
 - name: name for the job  
 - cmd: bash comand to be executed  
 - fireTime: the time when job should be executed  
  - Loca Time formate: `YYYY-MM-DD HH:MM:SS`  
  - ISO time formate: `YYYY-MM-DDT00:00:00.000Z`  

Feel free to request new feature  
