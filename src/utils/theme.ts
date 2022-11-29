

const LightMap = {
    '--theme_bg_color' : '#e9eef3',
    '--theme_button_color' : '#1890ff'
  };

  const DarkMap = {
    '--theme_bg_color' : '#24292f',
    '--theme_button_color' : '#1890ff'
  };


const themeChange = (isLight: Boolean) =>{
    
    if(isLight){

        for(let key in LightMap){
            document.documentElement.style.setProperty(key, LightMap[key]);
        }
    }else{
        for(let key in DarkMap){
            document.documentElement.style.setProperty(key, DarkMap[key]);
        }
    }
}

export default themeChange
