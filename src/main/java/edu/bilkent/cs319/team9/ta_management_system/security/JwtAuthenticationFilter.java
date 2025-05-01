package edu.bilkent.cs319.team9.ta_management_system.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);


    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain)
            throws ServletException, IOException {

        String path = req.getServletPath();
        logger.debug(">>> Incoming request to [{}]", path);

        if (path.startsWith("/api/auth/")) {
            logger.debug(">>> Bypassing auth for [{}]", path);
            chain.doFilter(req, res);
            return;
        }

        String header = req.getHeader("Authorization");
        logger.debug(">>> Authorization header: [{}]", header);

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            String username = jwtUtil.extractUsername(token);
            logger.debug(">>> Token subject: [{}]", username);

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            boolean valid = jwtUtil.validateToken(token, userDetails);
            logger.debug(">>> Token valid? [{}]", valid);

            if (username != null
                    && SecurityContextHolder.getContext().getAuthentication() == null
                    && valid) {

                UserDetails ud = userDetailsService.loadUserByUsername(username);
                var authToken = new UsernamePasswordAuthenticationToken(
                        ud,                   // ← principal is now your CustomUserDetails
                        null,
                        ud.getAuthorities()
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
                logger.debug(">>> Authentication set for [{}]", username);
            }
        }

        chain.doFilter(req, res);
    }


}
