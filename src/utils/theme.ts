

const LightMap = {
    '--theme_bg_color' : '#e9eef3',
    '--theme_button_color' : '#1890ff',
    '--theme_header_bg_color': '#778899',
    '--theme_header_text_color': '#b3c0d1',
    '--theme_card_bg_color': '#fff',
    '--theme_card_text_color': 'rgba(0, 0, 0, 0.45)',
    '--theme_card_action_text_color': 'rgba(0, 0, 0, 0.45)',
    '--theme_divider_color': 'rgba(0, 0, 0, 0.45)',
    '--theme_a_modal_bg_color': '#fff',
    '--theme_a_modal_text_color': 'rgba(0, 0, 0, 0.45)',
    '--theme_header_active_bg_color': '#7788ff',
    '--theme_header_active_text_color': '#1890ff'
  };

  const DarkMap = {
    '--theme_bg_color' : '#24292f',
    '--theme_button_color' : '#1890ff',
    '--theme_header_bg_color': '#1C1C1C',
    '--theme_header_text_color': '#778899',
    '--theme_card_bg_color': '#4F4F4F',
    '--theme_card_text_color': 'rgba(255, 255, 255, 0.45)',
    '--theme_card_action_text_color': 'rgba(255, 255, 255, 0.45)',
    '--theme_divider_color': 'rgba(255, 255, 255, 0.85)',
    '--theme_a_modal_bg_color': '#4F4F4F',
    '--theme_a_modal_text_color': 'rgba(255, 255, 255, 0.45)',
    '--theme_header_active_bg_color': '#696969',
    '--theme_header_active_text_color': '#363636'
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
