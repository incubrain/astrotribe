<h1 align="center" style="margin-top: 0px;">AstroTribe</h1>
<!-- <p align="center" style="margin-bottom: 0px !important;">
  <img width="200" src="https://github.com/Drew-Macgibbon/design-portfolio/blob/main/public/readme/doom-logo.png" align="center">
</p> -->
<p align="center" >The AstroTribe App is a social network for astronomers and wannabe astronomers around the globe.</p>

<p align="center">
  <a href="https://astronera.org/">Production</a> --- |  .  | --- <a href="https://astrotribe.vercel.app/">Development</a>
</p>

We're currently working towards an open beta release. If you'd like to be notified when we launch,
register your interest [here](https://astrotribe.vercel.app/auth/register)

### Contributing:

Clone the `develop` Branch Create your Feature Branch `git checkout -b feature/amazing-feature` Open
a Pull Request against `develop` when the feature is ready for review


### Development Setup:

#### Stack

- Nuxt
- Vercel
- Supabase

#### Links

- Dev Site: https://astrotribe-git-develop-incubrain.vercel.app

#### Supabase:

install supabase locally if you don't have it already

```bash
brew install supabase/tap/supabase
```

```bash
// make sure docker is open
// download the images
supabase start
//
supabase login
// link the local project to production
supabase link --project-ref <project-id>
// pull down the database
supabase db pull
```


#### Migrations:

```bash
// create a migration based on changes made in local studio
supabase db diff -f new_employee
// reset db to verify changes
supabase db reset
```
