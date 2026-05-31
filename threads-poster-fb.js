const { IgApiClient } = require('instagram-private-api');

async function main() {
  const ig = new IgApiClient();
  
  // Facebook credentials
  const fbEmail = process.env.FB_EMAIL;
  const fbPassword = process.env.FB_PASSWORD;
  
  if (!fbEmail || !fbPassword) {
    console.error('ERROR: Set FB_EMAIL and FB_PASSWORD');
    process.exit(1);
  }
  
  console.log('Facebook Login:');
  console.log('Email:', fbEmail);
  
  // Generate device
  ig.state.generateDevice('nictimunnn');
  
  // Try Facebook login via built-in flow
  try {
    // First try direct IG login with FB email
    console.log('Attempting IG login with FB credentials...');
    const auth = await ig.account.login(fbEmail, fbPassword);
    console.log('Login success! User ID:', auth.pk);
    
    const user = await ig.account.currentUser();
    console.log('Profile:', user.username, '- Followers:', user.follower_count);
    
    // Test post to Threads
    const caption = 'Test post from Celltopia automation 🚀\n\n#celltopia #iphone';
    console.log('Posting to Threads...');
    const post = await ig.publish.text({
      text: caption,
      audience: 1,
    });
    console.log('Post created! Media ID:', post.media_id);
    console.log('SUCCESS!');
    
  } catch (err) {
    console.error('Login failed:', err.message);
    if (err.response?.body) {
      console.error('Response:', JSON.stringify(err.response.body, null, 2));
    }
    process.exit(1);
  }
}

main();
