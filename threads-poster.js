const { IgApiClient, AccountEditService } = require('instagram-private-api');

async function main() {
  const ig = new IgApiClient();
  
  // Login credentials
  const username = 'nictimunnn';
  const password = process.env.IG_PASSWORD;
  
  if (!password) {
    console.error('ERROR: Set IG_PASSWORD environment variable first');
    process.exit(1);
  }
  
  console.log('Logging in as @' + username + '...');
  
  // Generate device (randomized to avoid detection)
  ig.state.generateDevice(username);
  
  // Login
  const auth = await ig.account.login(username, password);
  console.log('Login success! User ID:', auth.pk);
  
  // Check if 2FA required
  if (ig.state.twoFactorRequired) {
    console.log('2FA required. Enter code from WhatsApp:');
    const code = await new Promise(resolve => {
      process.stdin.once('data', data => resolve(data.toString().trim()));
    });
    
    const response = await ig.account.twoFactorLogin({
      username,
      verificationCode: code,
      twoFactorIdentifier: ig.state.twoFactorInfo.twoFactorIdentifier,
      verificationMethod: '1', // WhatsApp
    });
    
    console.log('2FA verified! User ID:', response.logged_in_user.pk);
  }
  
  // Test: Get user info
  const user = await ig.account.currentUser();
  console.log('Profile:', user.username, '- Followers:', user.follower_count);
  
  // Test: Post to Threads (same as IG, just different audience selector)
  const caption = 'Test post from Celltopia automation 🚀\n\n#celltopia #iphone';
  
  console.log('Posting to Threads...');
  const post = await ig.publish.text({
    text: caption,
    audience: 1, // 0 = followers only, 1 = everyone (Threads)
  });
  
  console.log('Post created! Media ID:', post.media_id);
  console.log('SUCCESS!');
}

main().catch(err => {
  console.error('ERROR:', err.message);
  if (err.response) {
    console.error('Response:', err.response.body);
  }
  process.exit(1);
});
