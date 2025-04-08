// Storage module to handle local storage operations
export const storage = {
  // Save all lists and their tasks to local storage
  saveLists() {
    const lists = [];
    document.querySelectorAll('.list-box').forEach(listBox => {
      const listName = listBox.textContent;
      const tabId = `tab-${listName.replace(/\s+/g, "-").toLowerCase()}`;
      const tab = document.getElementById(tabId);
      
      if (tab) {
        const tasks = [];
        tab.querySelectorAll('.task-item').forEach(taskItem => {
          const taskData = {
            name: taskItem.querySelector('.task-name').textContent,
            description: taskItem.querySelector('.task-description')?.textContent || '',
            date: taskItem.querySelector('.task-date')?.textContent.replace('Due: ', '') || '',
            priority: taskItem.querySelector('.priority-dot').className.split(' ')[1].replace('priority-', ''),
            completed: taskItem.querySelector('.task-checkbox').checked
          };
          tasks.push(taskData);
        });
        
        lists.push({
          name: listName,
          tasks: tasks
        });
      }
    });
    
    localStorage.setItem('todoLists', JSON.stringify(lists));
  },

  // Load lists and tasks from local storage
  loadLists() {
    const savedLists = localStorage.getItem('todoLists');
    if (savedLists) {
      return JSON.parse(savedLists);
    }
    return [];
  }
}; 